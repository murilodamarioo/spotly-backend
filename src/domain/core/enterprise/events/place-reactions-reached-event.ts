import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PlaceReactionsReachedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public readonly placeId: UniqueEntityId,
    public readonly reactionsCount: number
  ) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.placeId
  }
}