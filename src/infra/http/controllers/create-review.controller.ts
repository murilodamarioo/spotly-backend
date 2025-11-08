import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags
} from '@nestjs/swagger'

import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { CreateReviewUseCase } from '@/domain/core/application/use-cases/create-review'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReviewPresenter } from '@/infra/presenters/review-with-reviewer-presenter'

const createReviewBodySchema = z.object({
  rating: z.number(),
  comment: z.string().optional(),
  attachments: z.array(z.uuid())
})

type CreateReviewBodySchema = z.infer<typeof createReviewBodySchema>

@ApiTags('reviews')
@ApiBearerAuth('jwt')
@Controller('/places/:placeId/reviews/new')
export class CreateReviewController {

  constructor(private createReview: CreateReviewUseCase) { }

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', example: 3 },
        comment: { type: 'string', example: 'I will always return here.' },
        attachments: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
        },
      }
    }
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        review: {
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            rating: { type: 'number', example: 3 },
            comment: { type: 'string', example: 'I will always return here.' },
            reviewerId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            placeId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
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