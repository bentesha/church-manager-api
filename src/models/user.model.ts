import { Model } from 'objection';
import { UserRow } from 'src/data/user.row';
import { UserRole } from './user.role.model';

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

  static get relationMappings() {
    return {
      role: {
        modelClass: UserRole,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'users.roleId',
          to: 'user_roles.id',
        },
      },
    };
  }

  /**
   * Exclude soft-deleted users by default.
   */
  static getQuery() {
    return this.query().where('isDeleted', false);
  }
}
