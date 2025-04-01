export class OnboardNotificationDto {
  userId: string;
  password: string;
}

export class NewUserNotificationDto {
  userId: string;
  password: string;
}

export class PasswordResetNotificationDto {
  userId: string;
  resetToken: string;
}

export class VerificationCodeNotificationDto {
  userId: string;
  verificationCode: string;
}

export class PasswordUpdatedNotificationDto {
  userId: string;
  password: string;
}
