import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class Config {
  port: number;

  mysql: {
    host: string;
    database: string;
    user: string;
    password: string;
  };

  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
    secure: boolean;
  };

  admin: {
    jwtSecret: string;
  };

  minio: {
    endPoint: string;
    port: number;
    accessKey: string;
    secretKey: string;
  };

  cubejs: {
    endpoint: string;
  };

  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    this.port = Number(process.env.PORT) || 3040;

    this.mysql = {
      host: String(process.env.MYSQL_HOST || ''),
      database: String(process.env.MYSQL_DATABASE || ''),
      user: String(process.env.MYSQL_USER || ''),
      password: String(process.env.MYSQL_PASSWORD || ''),
    };

    this.email = {
      host: String(process.env.EMAIL_HOST || ''),
      port: Number(process.env.EMAIL_PORT) || 587,
      user: String(process.env.EMAIL_USER || ''),
      password: String(process.env.EMAIL_PASSWORD || ''),
      from: String(
        process.env.EMAIL_FROM || 'noreply@churchmanagementsystem.com',
      ),
      secure: process.env.EMAIL_SECURE === 'true',
    };

    this.admin = {
      jwtSecret: String(
        process.env.ADMIN_JWT_SECRET || 'default-admin-jwt-secret',
      ),
    };

    this.minio = {
      endPoint: String(process.env.MINIO_ENDPOINT || 'minio'),
      port: Number(process.env.MINIO_PORT) || 9000,
      accessKey: String(process.env.MINIO_ACCESS_KEY || ''),
      secretKey: String(process.env.MINIO_SECRET_KEY || ''),
    };

    this.cubejs = {
      endpoint: String(
        process.env.CUBEJS_ENDPOINT || 'http://cubejs:4000/cubejs-api/v1',
      ),
    };
  }
}
