import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'

import z from 'zod'

import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

const createPlaceBodySchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  attachments: z.array(z.uuid())
})

type CretaePlaceBodySchema = z.infer<typeof createPlaceBodySchema>

@ApiTags('places')
@ApiBearerAuth('jwt')
@Controller('/places/new')
export class CreatePlaceController {

  constructor(private createPlace: CreatePlaceUseCase) { }

  @Post()
  @HttpCode(201)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Bart`s Pub' },
        category: { type: 'string', example: 'Pub' },
        description: { type: 'string', example: 'A cozy pub in the heart of the city.' },
        address: { type: 'string', example: '742 Evergreen Terrace' },
        city: { type: 'string', example: 'Springfield' },
        state: { type: 'string', example: 'IL' },
        attachments: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
        }
      },
      required: ['name', 'category', 'description', 'address', 'city', 'state']
    }
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Bart`s Pub' },
        category: { type: 'string', example: 'Pub' },
        description: { type: 'string', example: 'A cozy pub in the heart of the city.' },
        address: { type: 'string', example: '742 Evergreen Terrace' },
        city: { type: 'string', example: 'Springfield' },
        state: { type: 'string', example: 'IL' },
        attachments: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
        },
        createdAt: { type: 'string', format: 'date-time', example: '2023-10-05T14:48:00.000Z' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 }
      }
    }
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createPlaceBodySchema)) body: CretaePlaceBodySchema
  ) {
    const userId = user.sub

    const { name, category, description, address, city, state, attachments } = body

    const response = await this.createPlace.execute({
      userId,
      name,
      category,
      description,
      address,
      city,
      state,
      attachmentsIds: attachments
    })

    if (response.isFailure()) {
      throw new BadRequestException()
    }

    return response.value
  }
}