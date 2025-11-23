import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'

import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { GetProfileUseCase } from '@/domain/core/application/use-cases/get-profile'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ProfilePresenter } from '@/infra/presenters/profile-presenter'

@ApiTags('users')
@ApiBearerAuth('jwt')
@Controller('/users/me')
export class GetProfileController {

  constructor(private getProfile: GetProfileUseCase) { }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        profile: {
          properties: {
            name: { type: 'string', example: 'John Marston' },
            email: { type: 'string', example: 'jmarston@gmail.com' },
            bio: { type: 'string', example: 'I am John Marston' },
            profilePicture: { type: 'string', example: 'profile.png' },
            createdAt: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Resource not found.' },
        error: { type: 'string', example: 'Not Found' },
        statuCode: { type: 'number', example: 404 }
      }
    }
  })
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

    return { profile: ProfilePresenter.toHttp(response.value.profile) }
  }

}