import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { Interest } from 'src/models/interest.model';

@Injectable()
export class InterestService {
  async findAll(query: any): Promise<Array<Interest>> {
    return findQuery(Interest)
      .allowAll(true)
      .allowEager('[member, opportunity]')!
      .build(query);
  }
}
