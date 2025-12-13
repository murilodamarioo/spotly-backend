import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

import { Message } from '@/core/types/message'

import { Mail } from '@/domain/core/mail/mail'

import { EnvService } from '../env/env.service'

@Injectable()
export class MailService implements Mail {

  constructor(
    private mailService: MailerService,
    private envService: EnvService
  ) { }

  async sendMail(message: Message): Promise<void> {
    await this.mailService.sendMail({
      to: message.to,
      from: this.envService.get('EMAIL_USER'),
      subject: message.subject,
      template: 'index',
      context: {
        title: 'Mr.',
        name: 'John Doe',
        content: message.content
      }
    })
  }
}