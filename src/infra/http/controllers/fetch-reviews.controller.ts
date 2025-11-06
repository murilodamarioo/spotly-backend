import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common'

import z from 'zod'

import { FetchReviewsUseCase } from '@/domain/core/application/use-cases/fetch-review'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ReviewPresenter } from '@/infra/presenters/review-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/places/:placeId/reviews')
export class FetchReviewsController {

  constructor(private fetchReviews: FetchReviewsUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(
    @Param('placeId') placeId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const response = await this.fetchReviews.execute({
      placeId,
      page
    })

    const reviews = response.value?.reviews

    return {
      reviews: reviews ? reviews.map(review => ReviewPresenter.toHTTP(review)): []
    }
  }
}