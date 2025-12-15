import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch
} from '@nestjs/common'

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags
} from '@nestjs/swagger'

import z from 'zod'

import { InvalidPasswordError } from '@/core/errors/errors-message/invalid-password'
import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { ChangePasswordUseCase } from '@/domain/core/application/use-cases/change-password'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

const changePasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string()
})

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@ApiTags('users')
@ApiBearerAuth('jwt')
@Controller('/users/me/change-password')
export class ChangePasswordController {

  constructor(private changePassword: ChangePasswordUseCase) { }

  @Patch()
  @HttpCode(204)
  @ApiBody({
    schema: {
      properties: {
        oldPassword: { type: 'string', example: '0ldP@Ssw0rd' },
        newPassword: { type: 'string', example: 'NewP@Ssw0rd' }
      }
    }
  })
  @ApiNoContentResponse({ description: 'Password changed' })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Old password does not match with the current password' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found.' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
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