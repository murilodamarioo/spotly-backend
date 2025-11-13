import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param
} from '@nestjs/common'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { GetPlaceUseCase } from '@/domain/core/application/use-cases/get-place'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { PlacePresenter } from '@/infra/presenters/place-presenter'

@Controller('/places/:id')
export class GetPlaceController {

  constructor(private getPlace: GetPlaceUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(
    @Param('id') placeId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const response = await this.getPlace.execute({ userId, placeId })

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

    return { place: PlacePresenter.toHttp(response.value.place) }
  }
}