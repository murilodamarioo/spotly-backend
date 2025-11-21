import { PaginationParam } from '@/core/repositories/pagination-param'
import { DomainEvents } from '@/core/events/domain-events'

import { Review } from '@/domain/core/enterprise/entities/review'
import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'

import { ReviewSummary } from '@/infra/presenters/review-summary-presenter'

import { InMemoryReviewAttachmentsRepository } from './in-memory-review-attachments-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { ReviewDetails } from '@/infra/presenters/review-details-presenter'

export class InMemoryReviewsRepository implements ReviewsRepository {
  public reviews: Review[] = []

  constructor(
    private reviewsAttachmentsRepository: InMemoryReviewAttachmentsRepository,
    private usersRepository: InMemoryUsersRepository
  ) { }

  async findById(id: string): Promise<Review | null> {
    const review = this.reviews.find(
      (review) => review.id.toString() === id
    )

    return review ? review : null
  }

  async findManyByPlaceId(id: string, { page }: PaginationParam): Promise<ReviewSummary[]> {
    const reviews = this.reviews
      .filter(item => item.placeId.toString() === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .map((review) => {
        const reviewer = this.usersRepository.users.find(user => {
          return user.id.equals(review.reviewerId)
        })

        if (!reviewer) {
          throw new Error(
            `Reviewer with ID "${review.reviewerId.toString()}" does not exist`
          )
        }

        return {
          id: review.id.toString(),
          rating: review.rating,
          comment: review.comment,
          reviewerId: review.reviewerId.toString(),
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          reviewer: {
            name: reviewer.name,
            profilePicture: reviewer.profilePicture
          }
        }
      })

    return reviews
  }

  async findByIdWithDetails(id: string): Promise<ReviewDetails | null> {
    throw new Error('Method not implemented.')
  }

  async create(review: Review): Promise<void> {
    this.reviews.push(review)

    await this.reviewsAttachmentsRepository.createMany(
      review.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(review.id)
  }

  async delete(id: string): Promise<void> {
    const reviewIndex = this.reviews.findIndex(
      (review) => review.id.toString() === id
    )

    this.reviews.splice(reviewIndex, 1)

    this.reviewsAttachmentsRepository.deleteManyById(id)
  }
}