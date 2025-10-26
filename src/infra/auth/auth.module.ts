import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { EnvService } from '../env/env.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64')
        }
      }
    })
  ],
  providers: [
    EnvService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AuthModule { }