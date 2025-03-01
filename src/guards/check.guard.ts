import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Check } from 'src/decoractors/check.decorator';
import { User } from 'src/models/user.model';
import { RoleService } from 'src/services/role.service';

@Injectable()
export class CheckGuard implements CanActivate {
  constructor(
    private readonly roleService: RoleService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const action = this.reflector.get(Check, context.getHandler());

    if (!action) {
      return true;
    }
    const user: User = (request as any).user;
    const hasAccess = await this.roleService.canPerformAction(
      user.roleId,
      action,
    );
    if (!hasAccess) throw new UnauthorizedException();
    return true;
  }
}
