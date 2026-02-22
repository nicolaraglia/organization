import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface WelcomeEmailData {
  email: string;
  firstName: string;
  organizationName: string;
  temporaryPassword: string;
  loginUrl: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@flexqueue.com',
      to: data.email,
      subject: `Welcome to FlexQueue - ${data.organizationName}`,
      html: this.getWelcomeEmailTemplate(data),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${data.email}`);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error sending welcome email to ${data.email}: ${errorText}`);
      throw new Error('Failed to send welcome email');
    }
  }

  private getWelcomeEmailTemplate(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to FlexQueue!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName},</h2>
            <p>Your organization <strong>${data.organizationName}</strong> has been successfully registered with FlexQueue!</p>
            
            <p>You have been set up as the administrator of your organization. Here are your login credentials:</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Temporary Password:</strong> <code>${data.temporaryPassword}</code></p>
            </div>
            
            <p class="warning">⚠️ This is a temporary password. You will be required to change it upon your first login.</p>
            
            <a href="${data.loginUrl}" class="button">Login to Your Account</a>
            
            <h3>Next Steps:</h3>
            <ol>
              <li>Click the login button above or visit <a href="${data.loginUrl}">${data.loginUrl}</a></li>
              <li>Enter your email and temporary password</li>
              <li>Set up a new secure password</li>
              <li>Complete your organization profile</li>
              <li>Start using FlexQueue!</li>
            </ol>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} FlexQueue. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
