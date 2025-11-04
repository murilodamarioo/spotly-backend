import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param
} from '@nestjs/common'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { DeleteReviewUseCase } from '@/domain/core/application/use-cases/delete-review'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('reviews')
@ApiBearerAuth('jwt')
@Controller('/reviews/:id')
export class DeleteReviewController {

  constructor(private deleteReview: DeleteReviewUseCase) { }

  @Delete()
  @HttpCode(204)
  @ApiParam({ name: 'id', type: 'uuid', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  @ApiNoContentResponse({ description: 'Review deleted successfully' })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
  @ApiForbiddenResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Not allowed to perform this action.' },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 }
      }
    }
  })
  async handle(
    @Param('id') reviewId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const response = await this.deleteReview.execute({
      reviewerId: userId,
      reviewId
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}