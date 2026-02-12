import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; organizationId?: number; role?: string; }) {
    // Imposta role default a 'admin' o 'staff' se non fornito
    const role = body.role ?? 'admin';
    return this.userService.signup({ ...body, role });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }
}