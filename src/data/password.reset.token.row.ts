export interface PasswordResetTokenRow {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
  isUsed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}