import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Patch } from '@nestjs/common'

import z from 'zod'

import { ChangePasswordUseCase } from '@/domain/core/application/use-cases/change-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidPasswordError } from '@/core/errors/errors-message/invalid-password'

const changePasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string()
})

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/users/me/change-password')
export class ChangePasswordController {

  constructor(private changePassword: ChangePasswordUseCase) { }

  @Patch()
  @HttpCode(204)
  async hadle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(changePasswordBodySchema)) body: ChangePasswordBodySchema
  ) {
    const userId = user.sub

    const { oldPassword, newPassword } = body

    const response = await this.changePassword.execute({
      userId,
      oldPassword,
      newPassword
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidPasswordError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}