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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiGoneResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'

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

@ApiTags('authentication')
@Public()
@Controller('/reset-password')
export class ResetPasswordController {

  constructor(private resetPassword: ResetPasswordUseCase) { }

  @ApiQuery({
    name: 'token',
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @ApiBody({
    schema: {
      properties: {
        newPassword: { type: 'string', example: '@etwdf%VRqrs' }
      }
    }
  })
  @ApiNoContentResponse({ description: 'Reset password successfully' })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Invalid token provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiGoneResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Access token expired' },
        error: { type: 'string', example: 'Gone' },
        statusCode: { type: 'number', example: 410 }
      }
    }
  })
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