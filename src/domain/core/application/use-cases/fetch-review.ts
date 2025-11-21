import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'


import { ReviewsRepository } from '../repositories/reviews-repository'
import { ReviewSummary } from '@/infra/presenters/review-summary-presenter'

interface FetchReviewsUseCaseRequest {
  placeId: string
  page: number
}

type FetchReviewsUseCaseResponse = Either<null, { reviews: ReviewSummary[] }>

@Injectable()
export class FetchReviewsUseCase {
  constructor(private reviewsRepository: ReviewsRepository) { }

  async execute({ placeId, page }: FetchReviewsUseCaseRequest): Promise<FetchReviewsUseCaseResponse> {
    const reviews = await this.reviewsRepository.findManyByPlaceId(placeId, { page })

    return success({ reviews })
  }
}