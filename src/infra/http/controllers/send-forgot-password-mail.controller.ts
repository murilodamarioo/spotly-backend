import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post
} from '@nestjs/common'

import {
  ApiBody,
  ApiNotFoundResponse,
  ApiTags
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { SendForgotPasswordMailUseCase } from '@/domain/core/application/use-cases/send-forgot-password-mail'

import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import z from 'zod'

const sendForgotPasswordMailBodySchema = z.object({
  email: z.email()
})

type SendForgotPasswordMailBodySchema = z.infer<typeof sendForgotPasswordMailBodySchema>

const validationPipe = new ZodValidationPipe(sendForgotPasswordMailBodySchema)

@ApiTags('authentication')
@Public()
@Controller('/auth/sign-in/forgot-password')
export class SendForgotPasswordMailController {

  constructor(private sendForgotPasswordMail: SendForgotPasswordMailUseCase) { }

  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'john@gmail.com' }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
  @Post()
  @HttpCode(201)
  async handle(
    @Body(validationPipe) body: SendForgotPasswordMailBodySchema
  ) {
    const { email } = body

    const response = await this.sendForgotPasswordMail.execute({
      email
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}