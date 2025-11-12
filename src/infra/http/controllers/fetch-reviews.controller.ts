import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'

import z from 'zod'

import { FetchReviewsUseCase } from '@/domain/core/application/use-cases/fetch-review'

import { ReviewWithReviewerPresenter } from '@/infra/presenters/review-with-reviewer-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@ApiTags('reviews')
@ApiBearerAuth('jwt')
@Controller('/places/:placeId/reviews')
export class FetchReviewsController {

  constructor(private fetchReviews: FetchReviewsUseCase) { }

  @Get()
  @HttpCode(200)
  @ApiParam({
    name: 'placeId',
    type: 'string',
    example: 'a0b1c2d3-e4f5-6g7h-8i9j-0k1l2m3n4o'
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    example: 1
  })
  @ApiOkResponse({
    schema: {
      example: {
        reviews: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            rating: 4,
            comment: 'Great place! Would definitely come back.',
            reviewerId: '550e8400-e29b-41d4-a716-446655440000',
            createdAt: '2025-11-02T14:00:00Z',
            updatedAt: '2025-11-02T14:00:00Z',
            reviewer: {
              name: 'John Doe',
              profilePicture: 'https://example.com/profile-picture.jpg'
            }
          },
          {
            id: '660e8400-e29b-41d4-a716-446655440001',
            rating: 5,
            comment: 'Excellent service and atmosphere!',
            reviewerId: '550e8400-e29b-41d4-a716-446655440000',
            createdAt: '2025-11-03T10:00:00Z',
            updatedAt: null,
            reviewer: {
              name: 'Jane Smith',
              profilePicture: null
            }
          }
        ]
      }
    }
  })
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
      reviews: reviews ? reviews.map(ReviewWithReviewerPresenter.toHTTP) : []
    }
  }
}