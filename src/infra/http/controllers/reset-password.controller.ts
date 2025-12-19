import {
  BadRequestException,
  Body,
  Controller,
  GoneException,
  HttpCode,
  NotFoundException,
  Patch,
  Query
} from '@nestjs/common'

import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidTokenError } from '@/core/errors/errors-message/invalid-token'
import { ExpiredTokenError } from '@/core/errors/errors-message/expired-token'

import { ResetPasswordUseCase } from '@/domain/core/application/use-cases/reset-password'

import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const resetPasswordBodySchema = z.object({
  newPassword: z.string()
})

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

const tokenPayloadSchema = z.object({
  token: z.string()
})

type TokenPayload = z.infer<typeof tokenPayloadSchema>

const validationBodyPipe = new ZodValidationPipe(resetPasswordBodySchema)
const validationTokenPipe = new ZodValidationPipe(tokenPayloadSchema)

@Public()
@Controller('/reset-password')
export class ResetPasswordController {

  constructor(private resetPassword: ResetPasswordUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(
    @Query(validationTokenPipe) { token }: TokenPayload,
    @Body(validationBodyPipe) body: ResetPasswordBodySchema
  ) {
    const { newPassword } = body

    const response = await this.resetPassword.execute({
      token,
      newPassword
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidTokenError:
          throw new BadRequestException(error.message)
        case ExpiredTokenError:
          throw new GoneException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

}