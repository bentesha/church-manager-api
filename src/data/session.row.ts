export interface SessionRow {
  id: string; // Unique session identifier
  userId: string; // User association
  token: string; // Session token
  ipAddress: string | null; // IP address of the user (nullable)
  userAgent: string | null; // User agent string (nullable)
  isActive: boolean; // Indicates if the session is active
  createdAt: Date | string; // Session creation timestamp
  updatedAt: Date | string; // Session last update timestamp
  expiresAt: Date | string; // Expiration timestamp
}
