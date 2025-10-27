import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'

import { GetProfileUseCase } from '@/domain/core/application/use-cases/get-profile'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors-message'

@Controller('/users/my-profile')
export class GetProfileController {

  constructor(private getProfile: GetProfileUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const response = await this.getProfile.execute({ userId })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return response.value
  }

}