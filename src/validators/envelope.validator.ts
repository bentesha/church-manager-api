import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class CreateEnvelopeValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        startNumber: Joi.number().integer().greater(0).required(),
        endNumber: Joi.number().integer().less(10000).required(),
      }),
    );
  }
}

export class UpdateEnvelopeValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        startNumber: Joi.number().integer().greater(0).required(),
        endNumber: Joi.number().integer().less(10000).required(),
      }),
    );
  }
}

export class AssignEnvelopeValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        memberId: Joi.string().required(),
      }),
    );
  }
}
