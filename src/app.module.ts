import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { Todo } from './todo/todo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        if (databaseUrl) {
          // যদি Railway বা URL দেওয়া থাকে
          return {
            type: 'mysql' as const,
            url: databaseUrl,
            entities: [Todo],
            synchronize: true, // development only! production এ false করা উচিত
          };
        }
        // আল্টারনেটিভ: আলাদা ভেরিয়েবল ব্যবহার করলে
        return {
          type: 'mysql' as const,
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<number>('DB_PORT') || 3306),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          entities: [Todo],
          synchronize: true,
        };
      },
    }),
    TodoModule,
  ],
})
export class AppModule {}
