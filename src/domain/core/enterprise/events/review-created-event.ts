import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Review } from '../entities/review'

export class ReviewCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public review: Review

  constructor(review: Review) {
    this.ocurredAt = new Date()
    this.review = review
  }

  getAggregateId(): UniqueEntityId {
    return this.review.id
  }

}