import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './shared/env.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from './config/env.module'
import { EnvService } from './shared/env.service'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        type: 'postgres',
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        username: env.get('DB_USERNAME'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_NAME'),
        schema: process.env.TYPEORM_SCHEMA || 'public',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
