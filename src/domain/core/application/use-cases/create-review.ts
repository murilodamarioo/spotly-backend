import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Either, failure, success } from '@/core/either'

import { Review } from '../../enterprise/entities/review'

import { ReviewsRepository } from '../repositories/reviews-repository'
import { PlacesRepository } from '../repositories/places-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { ReviewAttachment } from '../../enterprise/entities/review-attachment'
import { ReviewAttachmentList } from '../../enterprise/entities/review-attachment-list'

interface CreateReviewUseCaseRequest {
  rating: number
  comment?: string | null
  reviewerId: string
  placeId: string
  attachmentsIds: string[]
}

type CreateReviewUseCaseResponse = Either<ResourceNotFoundError, { review: Review }>

export class CreateReviewUseCase {
  constructor(
    private reviewsRepository: ReviewsRepository,
    private placesRepository: PlacesRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    rating,
    comment,
    reviewerId,
    placeId,
    attachmentsIds
  }: CreateReviewUseCaseRequest): Promise<CreateReviewUseCaseResponse> {
    const user = await this.usersRepository.findById(reviewerId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const place = await this.placesRepository.findById(placeId)

    if (!place) {
      return failure(new ResourceNotFoundError())
    }

    const review = Review.create({
      rating,
      comment,
      reviewerId: user.id,
      placeId: place.id
    })

    const reviewsAttachments = attachmentsIds.map((attachmentId) => {
      return ReviewAttachment.create({
        reviewId: review.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    review.attachments = new ReviewAttachmentList(reviewsAttachments)

    await this.reviewsRepository.create(review)

    return success({ review })
  }

}