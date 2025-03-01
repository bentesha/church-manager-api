import { Model } from 'objection';
import { UserRoleRow } from 'src/data/user.role.row';

export class UserRole extends Model implements UserRoleRow {
  id: string;
  name: string;
  churchId: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;

  public static tableName = 'user_roles';
}
