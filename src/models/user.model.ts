import { Model } from 'objection';
import { UserRow } from 'src/data/user.row';

export class User extends Model implements UserRow {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  churchId: string;
  roleId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;

  public static tableName = 'users';

  /**
   * Exclude soft-deleted users by default.
   */
  static getQuery() {
    return this.query().where('isDeleted', false);
  }
}
