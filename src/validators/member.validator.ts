import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';
import { Gender } from 'src/types/gender';
import { MaritalStatus } from 'src/types/marital.status';
import { MarriageType } from 'src/types/marriage.type';
import { EducationLevel } from 'src/types/education.level';
import { MemberRole } from 'src/types/member.role';

export class CreateMemberValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        envelopeNumber: Joi.string().allow(null),
        firstName: Joi.string().required(),
        middleName: Joi.string().allow(null),
        lastName: Joi.string().required(),
        gender: Joi.string()
          .valid(...Object.values(Gender))
          .required(),
        dateOfBirth: Joi.alternatives()
          .try(Joi.date(), Joi.string())
          .allow(null),
        placeOfBirth: Joi.string().allow(null),
        profilePhoto: Joi.string().allow(null),
        maritalStatus: Joi.string()
          .valid(...Object.values(MaritalStatus))
          .required(),
        marriageType: Joi.string()
          .valid(...Object.values(MarriageType))
          .required(),
        dateOfMarriage: Joi.alternatives()
          .try(Joi.date(), Joi.string())
          .allow(null),
        spouseName: Joi.string().allow(null),
        placeOfMarriage: Joi.string().allow(null),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().allow(null),
        spousePhoneNumber: Joi.string().allow(null),
        residenceNumber: Joi.string().allow(null),
        residenceBlock: Joi.string().allow(null),
        postalBox: Joi.string().allow(null),
        residenceArea: Joi.string().allow(null),
        formerChurch: Joi.string().allow(null),
        occupation: Joi.string().allow(null),
        placeOfWork: Joi.string().allow(null),
        educationLevel: Joi.string()
          .valid(...Object.values(EducationLevel))
          .allow(null),
        profession: Joi.string().allow(null),
        memberRole: Joi.string()
          .valid(...Object.values(MemberRole))
          .required(),
        isBaptized: Joi.boolean().required(),
        isConfirmed: Joi.boolean().required(),
        partakesLordSupper: Joi.boolean().required(),
        fellowshipId: Joi.string().required(),
        nearestMemberName: Joi.string().allow(null),
        nearestMemberPhone: Joi.string().allow(null),
        attendsFellowship: Joi.boolean().required(),
        fellowshipAbsenceReason: Joi.string().allow(null),
      }),
    );
  }
}

export class UpdateMemberValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        envelopeNumber: Joi.string().allow(null).optional(),
        firstName: Joi.string().optional(),
        middleName: Joi.string().allow(null).optional(),
        lastName: Joi.string().optional(),
        gender: Joi.string()
          .valid(...Object.values(Gender))
          .optional(),
        dateOfBirth: Joi.alternatives()
          .try(Joi.date(), Joi.string())
          .allow(null)
          .optional(),
        placeOfBirth: Joi.string().allow(null).optional(),
        profilePhoto: Joi.string().allow(null).optional(),
        maritalStatus: Joi.string()
          .valid(...Object.values(MaritalStatus))
          .optional(),
        marriageType: Joi.string()
          .valid(...Object.values(MarriageType))
          .optional(),
        dateOfMarriage: Joi.alternatives()
          .try(Joi.date(), Joi.string())
          .allow(null)
          .optional(),
        spouseName: Joi.string().allow(null).optional(),
        placeOfMarriage: Joi.string().allow(null).optional(),
        phoneNumber: Joi.string().optional(),
        email: Joi.string().email().allow(null).optional(),
        spousePhoneNumber: Joi.string().allow(null).optional(),
        residenceNumber: Joi.string().allow(null).optional(),
        residenceBlock: Joi.string().allow(null).optional(),
        postalBox: Joi.string().allow(null).optional(),
        residenceArea: Joi.string().allow(null).optional(),
        formerChurch: Joi.string().allow(null).optional(),
        occupation: Joi.string().allow(null).optional(),
        placeOfWork: Joi.string().allow(null).optional(),
        educationLevel: Joi.string()
          .valid(...Object.values(EducationLevel))
          .allow(null)
          .optional(),
        profession: Joi.string().allow(null).optional(),
        memberRole: Joi.string()
          .valid(...Object.values(MemberRole))
          .optional(),
        isBaptized: Joi.boolean().optional(),
        isConfirmed: Joi.boolean().optional(),
        partakesLordSupper: Joi.boolean().optional(),
        fellowshipId: Joi.string().optional(),
        nearestMemberName: Joi.string().allow(null).optional(),
        nearestMemberPhone: Joi.string().allow(null).optional(),
        attendsFellowship: Joi.boolean().optional(),
        fellowshipAbsenceReason: Joi.string().allow(null).optional(),
      }),
    );
  }
}
