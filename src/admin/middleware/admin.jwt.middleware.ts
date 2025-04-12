import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Config } from '../../config';
import { AdminInfo } from '../types/admin.info';

@Injectable()
export class AdminJwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: Config,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Admin JWT token required');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const payload = this.jwtService.verify<AdminInfo>(token, {
        secret: this.config.admin?.jwtSecret || 'default-admin-secret', // Use default for testing if not configured
      });

      // Attach admin info to request for controllers to use
      req['admin'] = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid admin token');
    }
  }
}
