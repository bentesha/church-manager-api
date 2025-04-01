import * as Joi from 'joi';
import { ValidatorPipe } from 'src/validation/validator.pipe';

export class OnboardNotificationValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        userId: Joi.string().required(),
        password: Joi.string().required(),
      }),
    );
  }
}

export class NewUserNotificationValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        userId: Joi.string().required(),
        password: Joi.string().required(),
      }),
    );
  }
}

export class PasswordResetNotificationValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        userId: Joi.string().required(),
        resetToken: Joi.string().required(),
      }),
    );
  }
}

export class VerificationCodeNotificationValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        userId: Joi.string().required(),
        verificationCode: Joi.string().required(),
      }),
    );
  }
}

export class PasswordUpdatedNotificationValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        userId: Joi.string().required(),
        password: Joi.string().required(),
      }),
    );
  }
}
