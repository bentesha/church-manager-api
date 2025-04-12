import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminInfo } from '../types/admin.info';

/**
 * Extracts admin information from the request object
 * Usage: @MyAdmin() admin: AdminInfo
 */
export const MyAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AdminInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.admin;
  },
);