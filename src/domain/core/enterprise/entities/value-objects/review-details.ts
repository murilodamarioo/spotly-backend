import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Attachment } from '../attachment'

interface ReviewDetailsProps {
  reviewId: UniqueEntityId
  rating: number
  comment?: string | null
  attachments: Attachment[]
  reviewer: {
    name: string
    profilePicutre?: string | null
  }
  createdAt: Date
}

export class ReviewDetails extends ValueObject<ReviewDetailsProps> {
  get reviewId() {
    return this.props.reviewId
  }

  get rating() {
    return this.props.rating
  }

  get comment() {
    return this.props.comment
  }

  get attachments() {
    return this.props.attachments
  }

  get reviewer() {
    return this.props.reviewer
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: ReviewDetailsProps): ReviewDetails {
    return new ReviewDetails(props)
  }
}