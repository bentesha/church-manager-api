export interface UserCredentialRow {
  userId: string; // Foreign key to the users table (also primary key)
  username: string; // Username for login
  passwordHash: string; // Hashed password
  passwordSalt: string | null; // Optional password salt if needed
  lastLoginAt: Date | string | null; // Timestamp for last login (nullable)
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
