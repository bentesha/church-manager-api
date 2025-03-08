/**
 * Data Transfer Object for creating a new volunteer opportunity
 */
export class CreateOpportunityDto {
  /**
   * The name of the volunteer opportunity
   * @example "Sunday School Assistant"
   */
  name!: string;

  /**
   * Detailed description of the volunteer opportunity
   * @example "Help teach children during Sunday School sessions. Responsibilities include assisting the main teacher with activities and ensuring children's safety."
   */
  description!: string;
}

/**
 * Data Transfer Object for updating an existing volunteer opportunity
 */
export class UpdateOpportunityDto {
  /**
   * The updated name of the volunteer opportunity (optional)
   * @example "Youth Program Assistant"
   */
  name?: string;

  /**
   * The updated description of the volunteer opportunity (optional)
   * @example "Help coordinate and run activities for the youth program. Responsibilities include planning sessions, engaging with youth, and assisting the youth pastor."
   */
  description?: string;
}
