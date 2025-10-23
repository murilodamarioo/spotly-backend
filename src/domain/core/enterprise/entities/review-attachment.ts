import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface ReviewAttachmentProps {
  reviewId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class ReviewAttachment extends Entity<ReviewAttachmentProps> {
  get reviewId() {
    return this.props.reviewId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: ReviewAttachmentProps, id?: UniqueEntityId): ReviewAttachment {
    const reviewAttachment = new ReviewAttachment(props, id)

    return reviewAttachment
  }
}