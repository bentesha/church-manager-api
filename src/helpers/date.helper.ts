import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DateHelper {
  /**
   * Formats a given date/time value to 'YYYY-MM-DD HH:mm:ss'.
   * Defaults to the current date and time if no value is provided.
   *
   * @param {Date | string} value - The date/time to format.
   * @returns {string} The formatted date/time string.
   */
  formatDateTime(value: Date | string = new Date()): string {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Formats a given date value to 'YYYY-MM-DD'.
   * Defaults to the current date if no value is provided.
   *
   * @param {Date | string} value - The date to format.
   * @returns {string} The formatted date string.
   */
  formatDate(value: Date | string = new Date()): string {
    return moment(value).format('YYYY-MM-DD');
  }
}
