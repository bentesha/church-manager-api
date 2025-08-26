
import * as Joi from 'joi';
import { ValidatorPipe } from 'src/validation/validator.pipe';

export class MemberCountValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional().min(Joi.ref('startDate')),
      }),
    );
  }
}
