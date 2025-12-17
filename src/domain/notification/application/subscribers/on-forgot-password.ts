import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { ForgotPasswordEvent } from '@/domain/core/enterprise/events/forgot-password-event'
import { Mail } from '@/domain/core/mail/mail'

export class OnForgotPassword implements EventHandler {

  constructor(
    private usersRepository: UsersRepository,
    private mail: Mail
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendResetPasswordMail.bind(this),
      ForgotPasswordEvent.name
    )
  }


  private async sendResetPasswordMail({ passwordResetToken }: ForgotPasswordEvent) {
    const userId = passwordResetToken.userId.toString()

    const user = await this.usersRepository.findById(userId)
    
    if (!user) return

    const resetLink = `http://my-app.com/reset?token=${passwordResetToken.token}&id=${userId}`

    await this.mail.sendMail({
      to: user.email,
      subject: 'SPOTLY - Password Recovery',
      content: `Oops! Memory lapse? 🧠💨 Don't worry, 
        it happens to the best of us. Let’s get you back in the game before you forget what you came here for!
        👉 ${resetLink} 🔓`
    })
  }

}