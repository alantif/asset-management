import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // IMPORTANT: keep false (since DB already created)
      }),
    }),
    AssignmentsModule,
  ],
})
export class AppModule {}
