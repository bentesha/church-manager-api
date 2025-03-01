import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from 'src/models/session.model';

export const MySession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
