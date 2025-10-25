import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'

import { z } from 'zod'

import { UserAlreadyExistsError } from '@/core/errors/errors-message'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string().optional()
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/sign-up')
export class CreateAccountController {

  constructor(private registerUser: RegisterUserUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, bio } = body

    const response = await this.registerUser.execute({
      name,
      email,
      password,
      bio
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}