import z from 'zod'
import { Body, Controller, HttpCode, Put, Param, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'

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

@Controller('/places/:id/edit')
export class EditPlaceController {

  constructor(private editPlace: EditPlaceUseCase) { }

  @Put()
  @HttpCode(200)
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