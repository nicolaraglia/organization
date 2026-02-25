
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OrganizationResetPasswordService } from '../service/organization-resetpassword.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('organization')
@Controller('organization/resetpassword')
export class OrganizationResetPasswordController {  
    // This controller would handle HTTP requests related to password reset, such as initiating a password reset and completing the password reset process.
    @Inject()
    private readonly organizationResetPasswordService: OrganizationResetPasswordService;

    @Post('initiate')
    async initiatePasswordReset(@Req() req: Request, @Res() res: Response): Promise<void> {
        const { email } = req.body;
        try {
            await this.organizationResetPasswordService.initiatePasswordReset(email);
            res.status(200).json({ message: "Password reset initiated. Please check your email." });
        } catch (error) {
            res.status(500).json({ message: "An error occurred while initiating password reset.", error: error.message });
        }
    }

    @Post('complete')
    async completePasswordReset(@Req() req: Request, @Res() res: Response): Promise<void> {
        const { token, newPassword } = req.body;
        try {
            await this.organizationResetPasswordService.completePasswordReset(token, newPassword);
            res.status(200).json({ message: "Password reset successful." });
        } catch (error) {
            res.status(400).json({ message: "An error occurred while completing password reset.", error: error.message });
        }
    }
  
}   
