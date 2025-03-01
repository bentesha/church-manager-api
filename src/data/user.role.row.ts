export interface UserRoleRow {
  id: string; // Unique identifier for the role
  name: string; // Role name (Admin, Moderator, etc.)
  churchId: string; // Church association
  description: string | null; // Optional description of the role
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
