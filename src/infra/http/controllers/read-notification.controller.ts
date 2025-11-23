import { BadRequestException, Controller, ForbiddenException, HttpCode, NotFoundException, Param, Patch } from '@nestjs/common'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'

@Controller('notifications/:notificationId/read')
export class ReadNotificationController {

  constructor(private readNotification: ReadNotificationUseCase) { }

  @Patch()
  @HttpCode(204)
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