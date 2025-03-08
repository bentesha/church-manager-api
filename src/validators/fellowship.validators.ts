import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class CreateFellowshipValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().required(),
        notes: Joi.string().allow(null).optional(),
        // Leadership roles are not included in creation
        // as members need to be created and assigned to the fellowship first
      }),
    );
  }
}

export class UpdateFellowshipValidator extends ValidatorPipe {
  constructor() {
    super(
      Joi.object({
        name: Joi.string().optional(),
        notes: Joi.string().allow(null).optional(),
        chairmanId: Joi.string().allow(null).optional(),
        deputyChairmanId: Joi.string().allow(null).optional(),
        secretaryId: Joi.string().allow(null).optional(),
        treasurerId: Joi.string().allow(null).optional(),
      }),
    );
  }
}