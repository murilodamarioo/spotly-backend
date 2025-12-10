import { Injectable } from '@nestjs/common'

import { PlaceReactionsReachedEvent } from '@/domain/core/enterprise/events/place-reactions-reached-event'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'

import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class OnPlaceReactionsReached {
  constructor(
    private placesRepository: PlacesRepository,
    private sendNotificationUseCase: SendNotificationUseCase
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
  }
}