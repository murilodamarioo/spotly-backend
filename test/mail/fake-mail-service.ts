import { Message } from '@/core/types/message';
import { Mail } from '@/domain/core/mail/mail'

export class FakeMailService extends Mail {

  async sendMail(message: Message): Promise<void> {
    return
  }

}