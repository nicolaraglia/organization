import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as crypto from 'crypto';

type TokenPayload = {
  sub: number;
  email: string;
  role: string;
  organizationId: number | null;
  type: 'access' | 'refresh';
};

@Injectable()
export class OrganizationTokenService {
  issueAccessToken(user: User): { token: string; expiresIn: number } {
    const expiresIn = this.readIntEnv('ORG_ACCESS_TOKEN_TTL_SECONDS', 900);
    const token = this.signToken(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        type: 'access',
      },
      this.readEnv('JWT_SECRET', 'dev-secret-change-me'),
      expiresIn,
    );
    return { token, expiresIn };
  }

  issueRefreshToken(user: User): { token: string; expiresIn: number } {
    const expiresIn = this.readIntEnv('ORG_REFRESH_TOKEN_TTL_SECONDS', 60 * 60 * 24 * 7);
    const token = this.signToken(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        type: 'refresh',
      },
      this.readEnv('JWT_REFRESH_SECRET', this.readEnv('JWT_SECRET', 'dev-secret-change-me')),
      expiresIn,
    );
    return { token, expiresIn };
  }

  private signToken(payload: TokenPayload, secret: string, expiresIn: number): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const completePayload = { ...payload, iat, exp: iat + expiresIn };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(completePayload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(unsignedToken)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    return `${unsignedToken}.${signature}`;
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private readEnv(name: string, fallback: string): string {
    return process.env[name] ?? fallback;
  }

  private readIntEnv(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) {
      return fallback;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  }
}
