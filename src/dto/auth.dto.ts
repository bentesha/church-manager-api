export class LoginDto {
  username: string;
  password: string;
}

export class ForgotPasswordDto {
  email: string;
}

export class VerifyResetTokenDto {
  token: string;
}

export class ResetPasswordDto {
  token: string;
  password: string;
}