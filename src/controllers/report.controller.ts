import { BadGatewayException, Controller, Get, Query } from '@nestjs/common';
import { Config } from 'src/config';
import { MyChurch } from 'src/decorators/my.church.decorator';
import { DateHelper } from 'src/helpers/date.helper';
import { Church } from 'src/models/church.model';
import * as moment from 'moment';
import { MemberCountValidator } from 'src/validators/report.validators';

@Controller('report')
export class ReportController {
  constructor(
    private readonly config: Config,
    private readonly dateHelper: DateHelper,
  ) {}

  @Get('/member/count')
  async getMemberCount(
    @MyChurch() church: Church,
    @Query(MemberCountValidator) query: any,
  ) {
    const cubeQuery = {
      measures: ['members.count'],
      filters: [
        {
          member: 'churches.id',
          operator: 'equals',
          values: [church.id],
        },
      ],
    };

    if (query.startDate) {
      const startDate = moment(query.startDate).startOf('day').toDate();
      cubeQuery.filters.push({
        member: 'members.createdAt',
        operator: 'afterOrOnDate',
        values: [this.dateHelper.formatDateTime(startDate)],
      });
    }

    if (query.endDate) {
      const endDate = moment(query.endDate).endOf('day').toDate();
      cubeQuery.filters.push({
        member: 'members.createdAt',
        operator: 'beforeOrOnDate',
        values: [this.dateHelper.formatDateTime(endDate)],
      });
    }

    return this.getReport(cubeQuery);
  }

  @Get('/member/count-by-gender')
  async countByGender(@MyChurch() church: Church) {
    const query = {
      dimensions: ['members.gender'],
      measures: ['members.count'],
      filters: [
        {
          member: 'churches.id',
          operator: 'equals',
          values: [church.id],
        },
      ],
    };

    return this.getReport(query);
  }

  async getReport(query: any) {
    const resource = this.config.cubejs.endpoint + '/load';
    const response = await fetch(resource, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.log(await response.text());
      throw new BadGatewayException();
    }

    const json = await response.json();
    return json.data || {};
  }
}
