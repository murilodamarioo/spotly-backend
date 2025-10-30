import { BadRequestException, Body, ConflictException, Controller, HttpCode, NotFoundException, Put } from '@nestjs/common'

import z from 'zod'

import { ResourceNotFoundError, UserAlreadyExistsError } from '@/core/errors/errors-message'

import { EditUserUseCase } from '@/domain/core/application/use-cases/edit-user'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  bio: z.string()
})

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/users/me/edit')
export class EditUserController {

  constructor(private editUser: EditUserUseCase) { }

  @Put()
  @HttpCode(204)
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