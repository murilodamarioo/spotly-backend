import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param } from '@nestjs/common'

import { GetReviewUseCase } from '@/domain/core/application/use-cases/get-review'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { ReviewDetailsPresenter } from '@/infra/presenters/review-details-presenter'

@Controller('/reviews/:id')
export class GetReviewController {

  constructor(private getReview: GetReviewUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const response = await this.getReview.execute({ reviewId: id })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { review: ReviewDetailsPresenter.toHttp(response.value.review) }
  }
}