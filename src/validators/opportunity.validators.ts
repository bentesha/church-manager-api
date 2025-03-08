import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class CreateOpportunityValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
      }),
    );
  }
}

export class UpdateOpportunityValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
      }),
    );
  }
}
