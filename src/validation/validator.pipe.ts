import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ValidationException } from '../exceptions/validation.exception';

export class ValidatorPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  async transform(input: any, metadata: ArgumentMetadata): Promise<any> {
    // Check if input is not empty
    // if (Object.keys(input).length === 0) {
    //   throw new ValidationException(undefined, 'Payload cannot be empty')
    // }
    const { value, error } = this.schema.validate(input, { abortEarly: false });
    if (error) {
      const details = error.details.reduce((result, detail) => {
        result[detail.context!.key!] = detail.message;
        return result;
      }, {});
      throw new ValidationException(details);
    }
    return value;
  }
}
