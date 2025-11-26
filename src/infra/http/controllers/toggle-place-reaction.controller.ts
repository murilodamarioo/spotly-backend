import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch
} from '@nestjs/common'

import z from 'zod'

import { ReactionType } from '@/core/enums/reaction-type'
import { NotAllowedError } from '@/core/errors/errors-message'

import { TogglePlaceReactionUseCase } from '@/domain/core/application/use-cases/toggle-place-reaction'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

const TogglePlaceReactionBodySchema = z.object({
  reactionType: z.enum(ReactionType)
})

type TogglePlaceReactionBodySchema = z.infer<typeof TogglePlaceReactionBodySchema>

@Controller('/places/:id/reactions')
export class TogglePlaceReactionController {

  constructor(private togglePlaceReaction: TogglePlaceReactionUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') placeId: string,
    @CurrentUser() user: UserPayload,
    @Body() body: TogglePlaceReactionBodySchema
  ) {
    const userId = user.sub

    const reactionType = body.reactionType

    const response = await this.togglePlaceReaction.execute({
      placeId,
      userId,
      reactionType
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