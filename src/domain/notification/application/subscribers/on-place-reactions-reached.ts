import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'

import { PlaceReactionsReachedEvent } from '@/domain/core/enterprise/events/place-reactions-reached-event'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { Mail } from '@/domain/core/mail/mail'

import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnPlaceReactionsReached {
  constructor(
    private placesRepository: PlacesRepository,
    private usersReposiotry: UsersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
    private mail: Mail
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendReachingNotification.bind(this),
      PlaceReactionsReachedEvent.name
    )
  }

  private async sendReachingNotification(event: PlaceReactionsReachedEvent) {
    const place = await this.placesRepository.findById(event.placeId.toString())
    if (!place) return

    const recipientId = place.userId.toString()
    const title = 'Your Spot is rocking! 🤘🔥'
    const content = `Your Spot is receiving great feedback, reaching ${event.reactionsCount} likes! ⭐🎉`

    await this.sendNotificationUseCase.execute({
      recipientId,
      title,
      content
    })

    const user = await this.usersReposiotry.findById(recipientId)
    if (!user) return

    await this.mail.sendMail({
      to: user.email,
      subject: title,
      content
    })
  }
}