export interface UserRow {
  id: string; // Unique user identifier
  name: string; // Full name of the user
  email: string; // User email
  phoneNumber: string | null; // Contact number (nullable but required)
  churchId: string; // Church association
  roleId: string; // Role association
  isActive: boolean; // Indicates if user is active
  isDeleted: boolean; // Soft delete flag (false = active, true = deleted)
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
