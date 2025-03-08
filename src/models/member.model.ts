import { Model } from 'objection';
import { EducationLevel } from 'src/types/education.level';
import { Gender } from 'src/types/gender';
import { MarriageType } from 'src/types/marriage.type';
import { MaritalStatus } from 'src/types/marital.status';
import { MemberRow } from 'src/data/member.row';
import { MemberRole } from 'src/types/member.role';
import { Dependant } from './dependant.model';

/**
 * Objection.js model representing a church member
 */
export class Member extends Model implements MemberRow {
  id!: string;
  churchId!: string;
  envelopeNumber!: string | null;
  firstName!: string;
  middleName!: string | null;
  lastName!: string;
  gender!: Gender;
  dateOfBirth!: Date | string | null;
  placeOfBirth!: string | null;
  profilePhoto!: string | null;
  maritalStatus!: MaritalStatus;
  marriageType!: MarriageType;
  dateOfMarriage!: Date | string | null;
  spouseName!: string | null;
  placeOfMarriage!: string | null;
  phoneNumber!: string;
  email!: string | null;
  spousePhoneNumber!: string | null;
  residenceNumber!: string | null;
  residenceBlock!: string | null;
  postalBox!: string | null;
  residenceArea!: string | null;
  formerChurch!: string | null;
  occupation!: string | null;
  placeOfWork!: string | null;
  educationLevel!: EducationLevel | null;
  profession!: string | null;
  memberRole!: MemberRole;
  isBaptized!: boolean;
  isConfirmed!: boolean;
  partakesLordSupper!: boolean;
  fellowshipId!: string;
  nearestMemberName!: string | null;
  nearestMemberPhone!: string | null;
  attendsFellowship!: boolean;
  fellowshipAbsenceReason!: string | null;
  createdAt!: Date | string;
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
    const { Opportunity } = require('../models/opportunity.model');

    return {
      fellowship: {
        relation: Model.BelongsToOneRelation,
        modelClass: Fellowship,
        join: {
          from: 'members.fellowshipId',
          to: 'fellowships.id',
        },
      },
      interests: {
        relation: Model.ManyToManyRelation,
        modelClass: Opportunity,
        join: {
          from: 'members.id',
          through: {
            from: 'member_volunteer_interests.memberId',
            to: 'member_volunteer_interests.opportunityId',
            extra: ['createdAt', 'updatedAt'],
          },
          to: 'volunteer_opportunities.id',
        },
      },
      dependants: {
        relation: Model.HasManyRelation,
        modelClass: Dependant,
        join: {
          from: 'members.id',
          to: 'dependants.memberId',
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
