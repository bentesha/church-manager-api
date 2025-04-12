import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { UserRole } from 'src/models/user.role.model';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { RoleAction } from 'src/models/row.action.model';

export interface CreateRoleInfo {
  name: string;
  churchId: string;
  description?: string;
  actions?: string[];
}

export interface UpdateRoleInfo {
  name?: string;
  description?: string;
}

@Injectable()
export class RoleService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a role by its ID.
   * @param id - The role's unique identifier.
   * @returns The role record or undefined if not found.
   */
  async findById(id: string): Promise<UserRole | undefined> {
    return UserRole.query().findById(id);
  }

  /**
   * Finds a single role matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching role or undefined.
   */
  async findOne(query: Partial<UserRole>): Promise<UserRole | undefined> {
    return findQuery(UserRole).allowAll(true).build(query).first();
  }

  /**
   * Finds all roles that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching roles.
   */
  async findAll(query: Partial<UserRole>): Promise<Array<UserRole>> {
    return findQuery(UserRole).allowAll(true).build(query);
  }

  /**
   * Creates a new role record in the database.
   * @param info - The role details to be saved.
   * @returns The created role record.
   */
  async create(info: CreateRoleInfo): Promise<UserRole> {
    return UserRole.transaction(async (trx) => {
      // Create the role
      const role = {
        id: this.idHelper.generate(),
        name: info.name,
        churchId: info.churchId,
        description: info.description || null,
        createdAt: this.dateHelper.formatDateTime(),
        updatedAt: this.dateHelper.formatDateTime(),
      };
      await UserRole.query(trx).insert(role);
      
      // If actions are provided, create the role actions one by one
      if (info.actions && info.actions.length > 0) {
        for (const action of info.actions) {
          await RoleAction.query(trx).insert({
            id: this.idHelper.generate(),
            roleId: role.id,
            action,
          });
        }
      }
      
      return (await this.findById(role.id))!;
    });
  }

  /**
   * Updates an existing role record.
   * @param id - The role ID to update.
   * @param info - The fields to be updated.
   * @returns The updated role record or undefined if not found.
   */
  async update(
    id: string,
    info: UpdateRoleInfo,
  ): Promise<UserRole | undefined> {
    const updates: Partial<UserRole> = {
      name: info.name,
      description: info.description,
      updatedAt: this.dateHelper.formatDateTime(),
    };
    await UserRole.query().where({ id }).update(updates);
    return this.findById(id);
  }

  /**
   * Deletes a role record by its ID.
   * @param id - The role ID to delete.
   * @returns The deleted role record, or undefined if not found.
   */
  async delete(id: string): Promise<UserRole | undefined> {
    const role = await this.findById(id);
    await UserRole.query().deleteById(id);
    return role;
  }

  /**
   * Checks if a role is allowed to perform a specific action.
   * @param roleId - The role's unique identifier.
   * @param action - The action to check.
   * @returns True if the role has permission, otherwise false.
   */
  async canPerformAction(roleId: string, action: string): Promise<boolean> {
    const roleAction = await RoleAction.query()
      .where({ roleId, action })
      .first();
    return !!roleAction;
  }

  async getRoleActions(roleId: string): Promise<Array<RoleAction>> {
    return RoleAction.query().where({ roleId });
  }
}
