import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from 'src/models/session.model';

export const MyChurch = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    return request.church;
  },
);
