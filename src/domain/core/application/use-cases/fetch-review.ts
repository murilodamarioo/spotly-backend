import { Either, success } from '@/core/either'

import { Review } from '../../enterprise/entities/review'

import { ReviewsRepository } from '../repositories/reviews-repository'

interface FetchReviewsUseCaseRequest {
  placeId: string
  page: number
}

type FetchReviewsUseCaseResponse = Either<null, { reviews: Review[] }>

export class FetchReviewsUseCase {
  constructor(private reviewsRepository: ReviewsRepository) { }

  async execute({ placeId, page }: FetchReviewsUseCaseRequest): Promise<FetchReviewsUseCaseResponse> {
    const reviews = await this.reviewsRepository.findManyByPlaceId(placeId, { page })

    return success({ reviews })
  }
}