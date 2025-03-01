import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class IdHelper {
  /**
   * Generates a UUID (v4) and removes dashes to produce a compact identifier.
   *
   * @returns {string} A compact UUID without dashes.
   */
  generate(): string {
    const id: string = uuid();
    return id.replaceAll('-', '');
  }
}
