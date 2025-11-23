import { BadRequestException, Body, ConflictException, Controller, HttpCode, NotFoundException, Put } from '@nestjs/common'

import z from 'zod'

import { ResourceNotFoundError, UserAlreadyExistsError } from '@/core/errors/errors-message'

import { EditUserUseCase } from '@/domain/core/application/use-cases/edit-user'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'

const editUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  bio: z.string()
})

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@ApiTags('users')
@ApiBearerAuth('jwt')
@Controller('/users/me/edit')
export class EditUserController {

  constructor(private editUser: EditUserUseCase) { }

  @Put()
  @HttpCode(204)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Markus Nicolas' },
        email: { type: 'string', example: 'mark@gmail.com' },
        bio: { type: 'string', example: 'Coffe lover' }
      }
    }
  })
  @ApiNoContentResponse({ description: 'User updated successfully' })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User already exists with the same e-mail' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Resource not found.' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 }
      }
    }
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editUserBodySchema)) body: EditUserBodySchema
  ) {
    const userId = user.sub

    const { name, email, bio } = body

    const response = await this.editUser.execute({
      userId,
      name,
      email,
      bio
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}