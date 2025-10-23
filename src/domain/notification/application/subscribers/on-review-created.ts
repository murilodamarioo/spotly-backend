import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { ReviewCreatedEvent } from '@/domain/core/enterprise/events/review-created-event'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnReviewCreated implements EventHandler {

  constructor(
    private placesRepository: PlacesRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewReviewNotification.bind(this),
      ReviewCreatedEvent.name
    )
  }

  private async sendNewReviewNotification({ review }: ReviewCreatedEvent) {
    const place = await this.placesRepository.findById(review.placeId.toString())

    if (place) {
      await this.sendNotification.execute({
        recipientId: place.userId.toString(),
        title: 'New review in your Spot',
        content: `${place.name} received a new review`
      })
    }
  }
}