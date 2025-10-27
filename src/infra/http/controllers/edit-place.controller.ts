import z from 'zod'
import { Body, Controller, HttpCode, Put, Param, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { EditPlaceUseCase } from '@/domain/core/application/use-cases/edit-place'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

const editPlaceBodySchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  attachments: z.array(z.uuid()).optional()
})

type EditPlaceBodySchema = z.infer<typeof editPlaceBodySchema>

@ApiTags('places')
@ApiBearerAuth('jwt')
@Controller('/places/:id/edit')
export class EditPlaceController {

  constructor(private editPlace: EditPlaceUseCase) { }

  @Put()
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Loop' },
        category: { type: 'string', example: 'Bar' },
        description: { type: 'string', example: 'You will always come back here' },
        address: { type: 'string', example: 'Av. Paulista, 1000' },
        city: { type: 'string', example: 'São Paulo' },
        state: { type: 'string', example: 'SP' },
        attachments: { type: 'array', items: { type: 'string', format: 'uuid' } }
      }
    }
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Loop' },
        category: { type: 'string', example: 'Bar' },
        description: { type: 'string', example: 'You will always come back here' },
        address: { type: 'string', example: 'Av. Paulista, 1000' },
        city: { type: 'string', example: 'São Paulo' },
        state: { type: 'string', example: 'SP' },
        attachments: { type: 'array', items: { type: 'string', format: 'uuid' } }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Resource not found.' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
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
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') placeId: string,
    @Body(new ZodValidationPipe(editPlaceBodySchema)) body: EditPlaceBodySchema
  ) {
    const userId = user.sub

    const { name, category, description, address, city, state, attachments } = body

    const response = await this.editPlace.execute({
      userId,
      placeId,
      name,
      category,
      description,
      address,
      city,
      state,
      attachmentsIds: attachments || []
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

    return response.value
  }
} 