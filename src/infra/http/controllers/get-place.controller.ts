import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { GetPlaceUseCase } from '@/domain/core/application/use-cases/get-place'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { PlacePresenter } from '@/infra/presenters/place-presenter'

@ApiTags('places')
@ApiBearerAuth('jwt')
@Controller('/places/:id')
export class GetPlaceController {

  constructor(private getPlace: GetPlaceUseCase) { }

  @Get()
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'c4b5b4b5-b4b5-b4b5-b4b5-b4b5b4b5b4b5'
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        place: {
          properties: {
            id: { type: 'string', example: 'c4b5b4b5-b4b5-b4b5-b4b5-b4b5b4b5b4b5' },
            name: { type: 'string', example: 'Place name' },
            category: { type: 'string', example: 'Category' },
            description: { type: 'string', example: 'Description' },
            address: { type: 'string', example: 'Address' },
            city: { type: 'string', example: 'City' },
            state: { type: 'string', example: 'State' },
            createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
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