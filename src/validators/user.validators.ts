import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class CreateUserValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        roleId: Joi.string().required(),
        password: Joi.string().required(),
        sendEmail: Joi.boolean().optional(),
      }),
    );
  }
}

export class UpdateUserValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        roleId: Joi.string().optional(),
        username: Joi.string().optional(),
        password: Joi.string().optional(),
        sendEmail: Joi.boolean().optional(),
      }),
    );
  }
}

export class UpdateProfileValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        currentPassword: Joi.string().when('newPassword', {
          is: Joi.exist(),
          then: Joi.string().required(),
          otherwise: Joi.string().optional(),
        }),
        newPassword: Joi.string().optional().min(6),
      }),
    );
  }
}
