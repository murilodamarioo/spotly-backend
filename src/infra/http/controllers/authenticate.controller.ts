import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'

import { Public } from '@/infra/auth/public'
import { InvalidCredentialsError } from '@/core/errors/errors-message'

const authenticateUserBodySchema = z.object({
  email: z.email(),
  password: z.string()
})

type AuthenticateuserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Public()
@Controller('/auth/sign-in')
export class AuthenticateController {

  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @Post()
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