import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import z from 'zod'

import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'

import { Public } from '@/infra/auth/public'
import { InvalidCredentialsError } from '@/core/errors/errors-message'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateUserBodySchema = z.object({
  email: z.email(),
  password: z.string()
})

type AuthenticateuserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Public()
@ApiTags('authentication')
@Controller('/auth/sign-in')
export class AuthenticateController {

  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'NeWP@ssword' }
      },
      required: ['email', 'password']
    }
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'email/password is incorrect.' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  async handle(@Body() body: AuthenticateuserBodySchema) {
    const { email, password } = body

    const response = await this.authenticateUser.execute({
      email,
      password
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return response.value
  }
}