import { BadRequestException, Controller, Delete, ForbiddenException, HttpCode, Param } from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/errors-message'

import { DeletePlaceUseCase } from '@/domain/core/application/use-cases/delete-place'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/places/:id')
export class DeletePlaceController {

  constructor(private deletePlace: DeletePlaceUseCase) { }

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') placeId: string) {
    const userId = user.sub

    const response = await this.deletePlace.execute({
      userId,
      placeId
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}