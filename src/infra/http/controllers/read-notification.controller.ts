import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('notifications')
@ApiBearerAuth('jwt')
@Controller('notifications/:notificationId/read')
export class ReadNotificationController {

  constructor(private readNotification: ReadNotificationUseCase) { }

  @Patch()
  @HttpCode(204)
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiNoContentResponse({ description: 'Notification marked as read' })
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
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const response = await this.readNotification.execute({
      recipientId: userId,
      notificationId
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
  }
}