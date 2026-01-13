// typeorm.config.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD ?? ''),
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
