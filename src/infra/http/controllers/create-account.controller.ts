import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { z } from 'zod'

import { UserAlreadyExistsError } from '@/core/errors/errors-message'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string().optional(),
  categories: z.array(z.uuid())
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Public()
@ApiTags('account')
@Controller('/sign-up')
export class CreateAccountController {

  constructor(private registerUser: RegisterUserUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'John Wick' },
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'nEwP@ssw0rd' },
        bio: { type: 'string', example: 'I am John Wick, the best hitman in the world.' },
        categories: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
        }
      },
      required: ['name', 'email', 'password']
    }
  })
  @ApiCreatedResponse({ description: 'Account created successfully' })
  @ApiConflictResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'User already exists with the same e-mail' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      }
    }
  })
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, bio, categories } = body

    const response = await this.registerUser.execute({
      name,
      email,
      password,
      bio,
      categoryIds: categories
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