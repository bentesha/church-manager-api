import { Model } from 'objection';
import { RoleActionRow } from 'src/data/role.action.row';

export class RoleAction extends Model implements RoleActionRow {
  id: string;
  roleId: string;
  action: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  public static tableName = 'role_actions';
}
