import { Module } from '@nestjs/common'

import { OnReviewCreated } from '@/domain/notification/application/subscribers/on-review-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { DatabaseModule } from '../database/database.module'
import { OnPlaceReactionsReached } from '@/domain/notification/application/subscribers/on-place-reactions-reached'

@Module({
  imports: [DatabaseModule],
  providers: [OnReviewCreated, OnPlaceReactionsReached, SendNotificationUseCase]
})
export class EventsModule { }