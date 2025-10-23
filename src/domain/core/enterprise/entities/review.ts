import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Optional } from '@/core/types/optional'

import { ReviewAttachmentList } from './review-attachment-list'

import { ReviewCreatedEvent } from '../events/review-created-event'

export interface ReviewProps {
  rating: number
  comment?: string | null
  attachments: ReviewAttachmentList
  reviewerId: UniqueEntityId
  placeId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class Review extends AggregateRoot<ReviewProps> {
  get rating() {
    return this.props.rating
  }

  get comment() {
    return this.props.comment
  }

  set comment(comment: string | null | undefined) {
    this.props.comment = comment
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: ReviewAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get reviewerId() {
    return this.props.reviewerId
  }

  get placeId() {
    return this.props.placeId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<ReviewProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId): Review {
    const review = new Review({
      ...props,
      attachments: props.attachments ?? new ReviewAttachmentList(),
      createdAt: props.createdAt ?? new Date()
    }, id)

    const isNewReview = !id
    
    if (isNewReview) {
      review.addDomainEvent(new ReviewCreatedEvent(review))
    }

    return review
  }
}