import {
  Body,
  Controller,
  Post,
  Req,
  BadRequestException,
  Get,
  NotFoundException,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/services/user.service';
import { AuthService, LoginInfo } from 'src/services/auth.service';
import { SessionService } from 'src/services/session.service';
import { Session } from 'src/models/session.model';
import { MySession } from 'src/decorators/my.session.decorator';
import { User } from 'src/models/user.model';
import { Me } from 'src/decorators/me.decorator';
import { RoleService } from 'src/services/role.service';
import { PasswordResetTokenService } from 'src/services/password.reset.token.service';
import { PasswordHelper } from 'src/helpers/password.helper';
import { EmailService } from 'src/services/email.service';
import { ChurchService } from 'src/services/church.service';
import { ForgotPasswordDto, ResetPasswordDto } from 'src/dto/auth.dto';
import {
  ForgotPasswordValidator,
  ResetPasswordValidator,
} from 'src/validators/auth.validator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly passwordHelper: PasswordHelper,
    private readonly emailService: EmailService,
    private readonly churchService: ChurchService,
  ) {}

  @Post('/login')
  async login(@Body() body: any, @Req() req: Request) {
    const { username, password } = body;

    // Extract IP Address and User-Agent
    const ipAddress = req.ip ?? null;
    const userAgent = req.headers['user-agent'] || null;

    // Prepare login info
    const loginInfo: LoginInfo = { username, password, ipAddress, userAgent };

    // Authenticate using AuthService
    const session = await this.authService.login(loginInfo);
    if (!session) {
      throw new BadRequestException('Invalid credentials');
    }

    // Fetch user details
    const user = await this.userService.findById(session.userId);

    // Get all actions allowed to allowed to the user's role
    const roleActions = await this.roleService.getRoleActions(user!.roleId);

    // Return session token and user details
    return {
      token: session.token,
      user,
      allowedActions: roleActions.map((item) => item.action),
    };
  }

  @Post('/logout')
  async logout(@MySession() session: Session) {
    await this.sessionService.deactivate(session.id);
    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  async me(@Me() user: User) {
    const roleActions = await this.roleService.getRoleActions(user.roleId);
    return {
      user,
      allowedActions: roleActions.map((item) => item.action),
    };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body(ForgotPasswordValidator) body: ForgotPasswordDto) {
    // Check if user exists with this email
    const user = await this.userService.findOne({ email: body.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get the user's church
    const church = await this.churchService.findById(user.churchId);

    // Create a password reset token (valid for 24 hours)
    const tokenRecord = await this.passwordResetTokenService.createToken({
      userId: user.id,
      expiresInHours: 24,
    });

    // Generate reset link using church service
    const resetLink = this.churchService.getResetLink(
      church!,
      tokenRecord.token,
    );

    // Send password reset email
    await this.emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetLink,
    });

    // Return 201 Created with no content
    return;
  }

  @Get('/verify-reset-token/:token')
  async verifyResetToken(@Param('token') token: string) {
    const tokenRecord =
      await this.passwordResetTokenService.validateToken(token);

    if (!tokenRecord) {
      return { valid: false };
    }

    // Verify the user exists
    const user = await this.userService.findById(tokenRecord.userId);
    if (!user) {
      return { valid: false };
    }

    return { valid: true };
  }

  @Post('/reset-password')
  async resetPassword(@Body(ResetPasswordValidator) body: ResetPasswordDto) {
    // Validate token
    const tokenRecord = await this.passwordResetTokenService.validateToken(
      body.token,
    );
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Get user
    const user = await this.userService.findById(tokenRecord.userId);

    // Get the user's church
    const church = await this.churchService.findById(user!.churchId);

    // Hash new password
    const { hash, salt } = this.passwordHelper.hashPassword(body.password);

    // Update user password
    await this.userService.update(user!.id, {
      passwordHash: hash,
      passwordSalt: salt,
    });

    // Mark token as used
    await this.passwordResetTokenService.useToken(body.token);

    // Deactivate all user sessions
    await this.sessionService.deactivateAll(user!.id);

    // Send password updated notification email
    await this.emailService.sendPasswordUpdatedEmail({
      to: user!.email,
      name: user!.name,
      churchName: church!.name,
      email: user!.email,
      password: body.password,
      loginLink: this.churchService.getLoginLink(church!),
    });

    // Return 201 Created with no content
    return;
  }
}
