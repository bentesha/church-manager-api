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
  }
}
