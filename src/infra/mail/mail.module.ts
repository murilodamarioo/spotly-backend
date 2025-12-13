import { resolve } from 'path'

import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { Mail } from '@/domain/core/mail/mail'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        transport: {
          host: envService.get('EMAIL_HOST'),
          port: envService.get('EMAIL_PORT'),
          secure: false,
          auth: {
            user: envService.get('EMAIL_USER'),
            pass: envService.get('EMAIL_PASS')
          }
        },
        defaults: {
          from: `"Spotly App" <${envService.get('EMAIL_USER')}>`
        },
        template: {
          dir: resolve(process.cwd(), 'dist', 'src', 'infra', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      })
    })
  ],
  providers: [
    EnvService,
    {
      provide: Mail,
      useClass: MailService
    }
  ],
  exports: [Mail]
})
export class MailModule { }