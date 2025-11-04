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

@Controller('/reviews/:id')
export class DeleteReviewController {

  constructor(private deleteReview: DeleteReviewUseCase) { }

  @Delete()
  @HttpCode(204)
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