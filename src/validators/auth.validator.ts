import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class LoginValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    );
  }
}

export class ForgotPasswordValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        email: Joi.string().email().required(),
      }),
    );
  }
}

export class VerifyResetTokenValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        token: Joi.string().required(),
      }),
    );
  }
}

export class ResetPasswordValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
      }),
    );
  }
}

export class ChurchOnboardValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        // Church information
        name: Joi.string().required(),
        domainName: Joi.string().required(),
        contactPhone: Joi.string().required(),
        contactEmail: Joi.string().email().required(),
        
        // Admin user information
        adminName: Joi.string().required(),
        adminEmail: Joi.string().email().required(),
        adminPhone: Joi.string().optional(),
        adminPassword: Joi.string().min(6).required(),
      }),
    );
  }
}
