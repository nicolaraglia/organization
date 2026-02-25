import { Inject, Injectable } from "@nestjs/common";
import { OrganizationRepository } from "../repository/organization.repository";
import { generate } from "rxjs";
import { randomUUID } from "crypto";

@Injectable()
export class OrganizationResetPasswordService {
    @Inject()
    private readonly organizationRepository: OrganizationRepository;

    async initiatePasswordReset(email: string): Promise<void> {
        // 1. Find the user by email
        const userByemail = await this.organizationRepository.findUserByEmail(email);
        // 2. Generate a password reset token
        const uuid = this.generatePasswordResetToken();
        // 3. Save the token with an expiration time
        await this.organizationRepository.updateUserPasswordResetToken(userByemail.id, uuid);
    }

    private generatePasswordResetToken(): string {
        // This function would generate a secure token, possibly using a library like crypto or uuid
        // The token should be unique and hard to guess
        // 4. Send a password reset email to the user with the token
        //can you complete this function?
        return randomUUID();
    
    
    }

    async completePasswordReset(token: string, newPassword: string): Promise<void> {
        // 1. Validate the reset token (check if it exists and is not expired)
        // This would involve querying the database for a user with the given reset token and checking the expiration time
        
        
        const user = await this.organizationRepository.findUserByResetToken(token);
        const expiresAt = user?.passwordResetTokenExpiresAt ?? null;

        if (!user || !expiresAt || expiresAt < new Date()) {
            throw new Error("Invalid or expired reset token");
        }


        // 2. If valid, hash the new password and update the user's password in the database
        const hashedPassword = await this.hashPassword(newPassword);
        await this.organizationRepository.updateUserPassword(user.id, hashedPassword);  

        // 3. Invalidate the used reset token
        await this.organizationRepository.updateUserPasswordResetToken(user.id, null);
        
    }
    hashPassword(newPassword: string) {
        throw new Error("Method not implemented.");
    }
}

