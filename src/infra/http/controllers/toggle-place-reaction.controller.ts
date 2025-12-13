import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch
} from '@nestjs/common'

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'

import z from 'zod'

import { ReactionType } from '@/core/enums/reaction-type'
import { InvalidAttachementTypeError, NotAllowedError } from '@/core/errors/errors-message'

import { TogglePlaceReactionUseCase } from '@/domain/core/application/use-cases/toggle-place-reaction'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

const TogglePlaceReactionBodySchema = z.object({
  reactionType: z.enum(ReactionType)
})

type TogglePlaceReactionBodySchema = z.infer<typeof TogglePlaceReactionBodySchema>

@ApiTags('reactions')
@ApiBearerAuth('jwt')
@Controller('/places/:placeId/reactions')
export class TogglePlaceReactionController {

  constructor(private togglePlaceReaction: TogglePlaceReactionUseCase) { }

  @Patch()
  @HttpCode(204)
  @ApiParam({
    name: 'placeId',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiBody({
    schema: {
      properties: {
        reactionType: {
          type: 'string',
          enum: Object.values(ReactionType)
        }
      }
    }
  })
  @ApiNoContentResponse({ description: 'Reaction successfully toggled' })
  @ApiForbiddenResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Not allowed to perform this action.' },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Invalid reaction type' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  async handle(
    @Param('placeId') placeId: string,
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
        case InvalidAttachementTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}