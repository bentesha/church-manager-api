export class OnboardChurchDto {
  // Church information
  name: string;
  domainName: string;
  contactPhone: string;
  contactEmail: string;

  // Admin user information
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  adminPassword: string;
  
  // Options
  sendEmail?: boolean; // Defaults to true if not specified
}