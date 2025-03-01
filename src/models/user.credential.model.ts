import { Model } from 'objection';
import { UserCredentialRow } from 'src/data/user.credential.row';

export class UserCredential extends Model implements UserCredentialRow {
  userId: string;
  username: string;
  passwordHash: string;
  passwordSalt: string | null;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;

  public static tableName = 'user_credentials';
}
