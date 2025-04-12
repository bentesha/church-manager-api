import { ValidatorPipe } from 'src/validation/validator.pipe';
import * as Joi from 'joi';

export class OnboardChurchValidator extends ValidatorPipe {
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
        
        // Options
        sendEmail: Joi.boolean().default(true),
      }),
    );
  }
}