import {
  BadRequestException,
  Controller,
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

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { GetPlaceUseCase } from '@/domain/core/application/use-cases/get-place'

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
  async handle(
    @Param('id') placeId: string,
  ) {

    const response = await this.getPlace.execute({ placeId })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { place: PlacePresenter.toHttp(response.value.place) }
  }
}