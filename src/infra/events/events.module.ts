import { Module } from '@nestjs/common'

import { OnReviewCreated } from '@/domain/notification/application/subscribers/on-review-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { OnPlaceReactionsReached } from '@/domain/notification/application/subscribers/on-place-reactions-reached'
import { OnForgotPassword } from '@/domain/notification/application/subscribers/on-forgot-password'

import { DatabaseModule } from '../database/database.module'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [
    OnReviewCreated,
    OnPlaceReactionsReached, 
    OnForgotPassword,
    SendNotificationUseCase
  ]

})
export class EventsModule { }