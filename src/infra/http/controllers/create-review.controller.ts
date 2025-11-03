import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'

import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { CreateReviewUseCase } from '@/domain/core/application/use-cases/create-review'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReviewPresenter } from '@/infra/presenters/review-presenter'

const createReviewBodySchema = z.object({
  rating: z.number(),
  comment: z.string().optional(),
  attachments: z.array(z.uuid())
})

type CreateReviewBodySchema = z.infer<typeof createReviewBodySchema>

@Controller('/places/:placeId/reviews/new')
export class CreateReviewController {

  constructor(private createReview: CreateReviewUseCase) { }

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('placeId') placeId: string,
    @Body() body: CreateReviewBodySchema
  ) {
    const userId = user.sub

    const { rating, comment, attachments } = body

    const response = await this.createReview.execute({
      placeId,
      reviewerId: userId,
      rating,
      comment,
      attachmentsIds: attachments
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { review: ReviewPresenter.toHTTP(response.value.review) }
  }
}