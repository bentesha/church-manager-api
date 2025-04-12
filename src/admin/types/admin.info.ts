/**
 * Interface for the admin information extracted from JWT token
 */
export interface AdminInfo {
  /** Unique identifier for the admin */
  id: string;
  
  /** Admin username */
  username: string;
  
  /** Optional expiration timestamp */
  exp?: number;
  
  /** Optional issued at timestamp */
  iat?: number;
}