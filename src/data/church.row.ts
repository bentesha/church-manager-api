export interface ChurchRow {
  id: string; // Unique identifier for the church
  name: string; // Church name
  domainName: string; // Unique domain for each church
  registrationNumber: string; // System-generated unique identifier for the church
  contactPhone: string; // Contact phone number for alerts and notifications
  contactEmail: string; // Contact email for alerts and notifications
  createdAt: Date | string; // Timestamp for record creation (nullable but required)
  updatedAt: Date | string; // Timestamp for last update (nullable but required)
}
