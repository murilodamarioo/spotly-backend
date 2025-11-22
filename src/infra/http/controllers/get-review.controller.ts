import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param } from '@nestjs/common'

import { GetReviewUseCase } from '@/domain/core/application/use-cases/get-review'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { ReviewDetailsPresenter } from '@/infra/presenters/review-details-presenter'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('reviews')
@ApiBearerAuth('jwt')
@Controller('/reviews/:id')
export class GetReviewController {

  constructor(private getReview: GetReviewUseCase) { }

  @Get()
  @HttpCode(200)
  @ApiParam({ name: 'id', type: 'string', example: '2352ae7b-b8c8-4ad1-a0b5-20265493a2fe' })
  @ApiOkResponse({
    schema: {
      properties: {
        review: {
          properties: {
            reviewId: { type: 'uuid', example: '2352ae7b-b8c8-4ad1-a0b5-20265493a2fe' },
            rating: { type: 'number', example: 5 },
            comment: { type: 'string', example: 'Great place' },
            reviewer: {
              properties: {
                name: { type: 'string', example: 'John Doe' },
                profilePicture: { type: 'string', example: 'a90c95a4-259f-4cdf-a975-ac910d1d0ca8-profile.png' }
              }
            },
            attachments: {
              type: 'array',
              items: { type: 'object' },
              example: [
                {
                  id: 'c06c928e-4856-4bc7-b91f-2288cfd7b77d',
                  title: 'restaurant.png',
                  url: 'a90c95a4-259f-4cdf-a975-ac910d1d0ca8-restaurant.png'
                }
              ]
            },
            createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
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