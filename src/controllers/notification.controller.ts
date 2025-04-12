import {
  Body,
  Controller,
  Post,
  NotFoundException,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { Check } from 'src/decoractors/check.decorator';
import { CheckGuard } from 'src/guards/check.guard';
import { MyChurch } from 'src/decorators/my.church.decorator';
import { EmailService } from 'src/services/email.service';
import { UserService } from 'src/services/user.service';
import { ChurchService } from 'src/services/church.service';
import { Church } from 'src/models/church.model';
import {
  NewUserNotificationValidator,
  OnboardNotificationValidator,
  PasswordResetNotificationValidator,
  PasswordUpdatedNotificationValidator,
  VerificationCodeNotificationValidator,
} from 'src/validators/notification.validator';
import {
  NewUserNotificationDto,
  OnboardNotificationDto,
  PasswordResetNotificationDto,
  PasswordUpdatedNotificationDto,
  VerificationCodeNotificationDto,
} from 'src/dto/notification.dto';

@Controller('notification')
@UseGuards(CheckGuard)
export class NotificationController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly churchService: ChurchService,
  ) {}

  @Post('onboard')
  @Check('notification.sendOnboard')
  async sendOnboard(
    @MyChurch() church: Church,
    @Body(OnboardNotificationValidator) body: OnboardNotificationDto,
  ) {
    // Get user details
    const user = await this.userService.findById(body.userId);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Generate login link
    const loginLink = this.churchService.getLoginLink(church);

    // Send email notification
    const result = await this.emailService.sendOnboardEmail({
      to: user.email,
      name: user.name,
      churchName: church.name,
      email: user.email,
      password: body.password,
      domain: church.domainName,
      loginLink,
    });

    if (!result) {
      throw new ServiceUnavailableException();
    }
  }

  @Post('new-user')
  @Check('notification.sendNewUser')
  async sendNewUser(
    @MyChurch() church: Church,
    @Body(NewUserNotificationValidator) body: NewUserNotificationDto,
  ) {
    // Get user details
    const user = await this.userService.findById(body.userId);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Generate login link
    const loginLink = this.churchService.getLoginLink(church);

    // Send email notification
    const result = await this.emailService.sendNewUserEmail({
      to: user.email,
      name: user.name,
      churchName: church.name,
      email: user.email,
      password: body.password,
      loginLink,
    });

    if (!result) {
      throw new ServiceUnavailableException();
    }
  }

  @Post('password-reset')
  @Check('notification.sendPasswordReset')
  async sendPasswordReset(
    @MyChurch() church: Church,
    @Body(PasswordResetNotificationValidator)
    body: PasswordResetNotificationDto,
  ) {
    // Get user details
    const user = await this.userService.findById(body.userId);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Generate reset link
    const resetLink = `https://${church.domainName}/reset-password?token=${body.resetToken}`;

    // Send email notification
    const result = await this.emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetLink,
    });

    if (!result) {
      throw new ServiceUnavailableException();
    }
  }

  @Post('verification-code')
  @Check('notification.sendVerificationCode')
  async sendVerificationCode(
    @MyChurch() church: Church,
    @Body(VerificationCodeNotificationValidator)
    body: VerificationCodeNotificationDto,
  ) {
    // Get user details
    const user = await this.userService.findById(body.userId);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Send email notification
    const result = await this.emailService.sendVerificationCodeEmail({
      to: user.email,
      name: user.name,
      churchName: church.name,
      verificationCode: body.verificationCode,
    });

    if (!result) {
      throw new ServiceUnavailableException();
    }
  }

  @Post('password-updated')
  @Check('notification.sendPasswordUpdated')
  async sendPasswordUpdated(
    @MyChurch() church: Church,
    @Body(PasswordUpdatedNotificationValidator)
    body: PasswordUpdatedNotificationDto,
  ) {
    // Get user details
    const user = await this.userService.findById(body.userId);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Generate login link
    const loginLink = this.churchService.getLoginLink(church);

    // Send email notification
    const result = await this.emailService.sendPasswordUpdatedEmail({
      to: user.email,
      name: user.name,
      churchName: church.name,
      email: user.email,
      password: body.password,
      loginLink,
    });

    if (!result) {
      throw new ServiceUnavailableException();
    }
  }
}
