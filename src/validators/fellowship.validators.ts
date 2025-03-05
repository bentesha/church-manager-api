import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class CreateFellowshipValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().required(),
        notes: Joi.string().allow(null).optional(),
      }),
    );
  }
}

export class UpdateFellowshipValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().optional(),
        notes: Joi.string().optional(),
      }),
    );
  }
}
