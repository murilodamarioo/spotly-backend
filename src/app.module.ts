import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './shared/env.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from './config/env.module'
import { EnvService } from './shared/env.service'

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
        username: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
