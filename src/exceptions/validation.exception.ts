import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(details?: { [key: string]: string }, message?: string) {
    super({
      statusCode: 400,
      message: message || 'Validation failed',
      error: 'Validation Error',
      details: details || {},
    });
  }
}
