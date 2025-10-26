import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'

import z from 'zod'

import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

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

@Controller('/places/create')
export class CreatePlaceController {

  constructor(private createPlace: CreatePlaceUseCase) { }

  @Post()
  @HttpCode(201)
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