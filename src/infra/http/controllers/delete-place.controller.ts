import { BadRequestException, Controller, Delete, ForbiddenException, HttpCode, Param } from '@nestjs/common'

import { ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { NotAllowedError } from '@/core/errors/errors-message'

import { DeletePlaceUseCase } from '@/domain/core/application/use-cases/delete-place'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('places')
@ApiBearerAuth('jwt')
@Controller('/places/:id')
export class DeletePlaceController {

  constructor(private deletePlace: DeletePlaceUseCase) { }

  @Delete()
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: 'uuid',
    example: 'a0b1c2d3-e4f5-6g7h-8i9j-0k1l2m3n4o'
  })
  @ApiNoContentResponse({ description: 'Place deleted successfully' })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Not allowed to perform this action.' },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 }
      }
    }
  })
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