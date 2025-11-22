import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { Either, failure, success } from '@/core/either'

import { ReviewsRepository } from '../repositories/reviews-repository'

import { ReviewDetails } from '../../enterprise/entities/value-objects/review-details'

interface GetReviewUseCaseRequest {
  reviewId: string
}

type GetReviewUseCaseResponse = Either<ResourceNotFoundError, { review: ReviewDetails }>

@Injectable()
export class GetReviewUseCase {

  constructor(private reviewsRepository: ReviewsRepository) { }

  async execute({ reviewId }: GetReviewUseCaseRequest): Promise<GetReviewUseCaseResponse> {
    const review = await this.reviewsRepository.findByIdWithDetails(reviewId)

    if (!review) {
      return failure(new ResourceNotFoundError())
    }

    return success({ review })
  }
}