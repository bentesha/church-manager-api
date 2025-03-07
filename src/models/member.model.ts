import { Model } from 'objection';
import { EducationLevel } from 'src/types/education.level';
import { Gender } from 'src/types/gender';
import { MarriageType } from 'src/types/marriage.type';
import { MaritalStatus } from 'src/types/marital.status';
import { MemberRow } from 'src/data/member.row';
import { MemberRole } from 'src/types/member.role';

/**
 * Objection.js model representing a church member
 */
export class Member extends Model implements MemberRow {
  /** Unique identifier for the member */
  id!: string;

  /** Reference to the church this member belongs to */
  churchId!: string;

  /** Unique envelope number assigned to registered members (1-4000). Unregistered members do not have one */
  envelopeNumber!: string | null;

  /** Member's first name */
  firstName!: string;

  /** Member's middle name */
  middleName!: string | null;

  /** Member's last name */
  lastName!: string;

  /** Member's gender */
  gender!: Gender;

  /** Member's date of birth */
  dateOfBirth!: Date | string | null;

  /** Member's place of birth */
  placeOfBirth!: string | null;

  /** URL to member's profile photo */
  profilePhoto!: string | null;

  /** Member's marital status */
  maritalStatus!: MaritalStatus;

  /** Type of marriage the member has */
  marriageType!: MarriageType;

  /** Date when the member got married */
  dateOfMarriage!: Date | string | null;

  /** Name of the member's spouse */
  spouseName!: string | null;

  /** Place where the marriage took place */
  placeOfMarriage!: string | null;

  /** Member's contact phone number */
  phoneNumber!: string;

  /** Member's email address */
  email!: string | null;

  /** Contact phone number of the member's spouse */
  spousePhoneNumber!: string | null;

  /** House number of the member's residence */
  residenceNumber!: string | null;

  /** Block number of the member's residence */
  residenceBlock!: string | null;

  /** Member's postal address */
  postalBox!: string | null;

  /** Area where the member resides */
  residenceArea!: string | null;

  /** Previous church the member attended */
  formerChurch!: string | null;

  /** Member's occupation or job */
  occupation!: string | null;

  /** Location where the member works */
  placeOfWork!: string | null;

  /** Member's level of education */
  educationLevel!: EducationLevel | null;

  /** Member's professional qualification or specialization */
  profession!: string | null;

  /** Role of the member in the church */
  memberRole!: MemberRole;

  /** Indicates whether the member has been baptized */
  isBaptized!: boolean;

  /** Indicates whether the member has been confirmed */
  isConfirmed!: boolean;

  /** Indicates whether the member participates in the Lord's Supper */
  partakesLordSupper!: boolean;

  /** Reference to the fellowship group the member belongs to */
  fellowshipId!: string;

  /** Name of the nearest church member for reference */
  nearestMemberName!: string | null;

  /** Phone number of the nearest member */
  nearestMemberPhone!: string | null;

  /** Indicates whether the member attends fellowship meetings */
  attendsFellowship!: boolean;

  /** Reason provided for not attending fellowship meetings */
  fellowshipAbsenceReason!: string | null;

  /** Timestamp when the record was created */
  createdAt!: Date | string;

  /** Timestamp when the record was last updated */
  updatedAt!: Date | string;

  /**
   * Set the table name for the model
   */
  public static tableName = 'members';

  /**
   * Set up model relationships
   */
  static get relationMappings() {
    // Import models for relationships to avoid circular dependencies
    const { Church } = require('../models/church.model');
    const { Fellowship } = require('../models/fellowship.model');

    return {
      church: {
        relation: Model.BelongsToOneRelation,
        modelClass: Church,
        join: {
          from: 'members.churchId',
          to: 'churches.id',
        },
      },
      fellowship: {
        relation: Model.BelongsToOneRelation,
        modelClass: Fellowship,
        join: {
          from: 'members.fellowshipId',
          to: 'fellowships.id',
        },
      },
    };
  }

  /**
   * Modifiers for common queries
   */
  static get modifiers() {
    return {
      /**
       * Get active members
       */
      active(query) {
        query.where('isConfirmed', true);
      },

      /**
       * Get members that attend fellowship
       */
      attendsFellowship(query) {
        query.where('attendsFellowship', true);
      },

      /**
       * Get baptized members
       */
      baptized(query) {
        query.where('isBaptized', true);
      },
    };
  }
}
