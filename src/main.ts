import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config';
import { Model } from 'objection';
import * as Knex from 'knex';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure database connection
  const config = app.get(Config);
  const knex = Knex({
    client: 'mysql2',
    connection: config.mysql,
  });
  Model.knex(knex);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
