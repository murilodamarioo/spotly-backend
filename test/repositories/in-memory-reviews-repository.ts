import { PaginationParam } from '@/core/repositories/pagination-param'
import { DomainEvents } from '@/core/events/domain-events'

import { Review } from '@/domain/core/enterprise/entities/review'
import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'

import { InMemoryReviewAttachmentsRepository } from './in-memory-review-attachments-repository'

export class InMemoryReviewsRepository implements ReviewsRepository {
  public reviews: Review[] = []

  constructor(private reviewsAttachmentsRepository: InMemoryReviewAttachmentsRepository) { }

  async findById(id: string): Promise<Review | null> {
    const review = this.reviews.find(
      (review) => review.id.toString() === id
    )

    return review ? review : null
  }

  async findManyByPlaceId(id: string, { page }: PaginationParam): Promise<Review[]> {
    const reviews = this.reviews
      .filter(item => item.placeId.toString() === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return reviews
  }

  async create(review: Review) {
    this.reviews.push(review)

    DomainEvents.dispatchEventsForAggregate(review.id)
  }

  async delete(id: string): Promise<void> {
    const reviewIndex = this.reviews.findIndex(
      (review) => review.id.toString() === id
    )

    this.reviews.splice(reviewIndex, 1)

    this.reviewsAttachmentsRepository.delete(id)
  }
}