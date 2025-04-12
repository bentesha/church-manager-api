import { Model } from 'objection';
import { PasswordResetTokenRow } from 'src/data/password.reset.token.row';

export class PasswordResetToken extends Model implements PasswordResetTokenRow {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
  isUsed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  public static tableName = 'password_reset_tokens';
}
