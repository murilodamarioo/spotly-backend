import { Either, failure, success } from '@/core/either'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { ReviewsRepository } from '../repositories/reviews-repository'

interface DeleteReviewUseCaseRequest {
  reviewId: string
  reviewerId: string
}

type DeleteReviewUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

export class DeleteReviewUseCase {
  constructor(private reviewsRepository: ReviewsRepository) { }

  async execute({reviewId, reviewerId}: DeleteReviewUseCaseRequest): Promise<DeleteReviewUseCaseResponse> {
    const review = await this.reviewsRepository.findById(reviewId)

    if (!review) {
      return failure(new ResourceNotFoundError())
    }

    if (reviewerId !== review.reviewerId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.reviewsRepository.delete(reviewId)

    return success(null)
  }
}