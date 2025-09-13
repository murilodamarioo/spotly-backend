import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'

import { ZodValidationPipe } from 'src/commons/pipes/zod-validation-pipe'
import { UserCreatedPresenter } from 'src/commons/presenters/user-created-presenter'
import { UserEmailAlreadyExistsError } from 'src/commons/errors/application-errors/user-email-already-exists'

import { UsersService } from './users.service'
import { createUserBodySchema, type CreateUserBodySchema } from './types/create-user-schema'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async create(@Body() body: CreateUserBodySchema) {
    const response = await this.usersService.create(body)

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case UserEmailAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { user: UserCreatedPresenter.toHTTP(response.value.user) }
  }
}
