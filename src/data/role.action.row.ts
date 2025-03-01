export interface RoleActionRow {
  id: string; // Unique identifier for the role action
  roleId: string; // Role association
  action: string; // Action name, e.g., 'user.create', 'user.update'
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
