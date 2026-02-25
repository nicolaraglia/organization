import { Inject, Injectable } from "@nestjs/common";
import { OrganizationRepository } from "../repository/organization.repository";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { EmailService } from "./email.service";

@Injectable()
export class OrganizationResetPasswordService {
    @Inject()
    private readonly organizationRepository: OrganizationRepository;
    @Inject()
    private readonly emailService: EmailService; // You would replace 'any' with the actual type of your email service

    async initiatePasswordReset(email: string): Promise<void> {
        // 1. Find the user by email
        const userByemail = await this.organizationRepository.findUserByEmail(email);
        if (!userByemail) {
            throw new Error("User with the provided email does not exist");
        }
        // 2. Generate a password reset token
        const uuid = this.generatePasswordResetToken();
        // 3. Save the token with an expiration time
        await this.organizationRepository.updateUserPasswordResetToken(userByemail.id, uuid);

        // 4. Send a password reset email to the user with the token
        // This would involve using an email service to send an email to the user with a link that includes the reset token
        // For example, the link might look like: https://yourapp.com/reset-password?token=uuid 
        // You would typically use a service like SendGrid, Amazon SES, or Nodemailer to send the email
        await this.emailService.sendEmail(
            userByemail.email,
            "Password Reset Request",
            `Please click the following link to reset your password: https://yourapp.com/reset-password?token=${uuid}`,
        );
        
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
    async hashPassword(newPassword: string): Promise<string> {
        // This function would hash the new password using a secure hashing algorithm like bcrypt
        // You would typically use a library like bcrypt to hash the password before storing it in the database
        // For example:
        const saltRounds = 10;
        return bcrypt.hash(newPassword, saltRounds);
        
    }
}
