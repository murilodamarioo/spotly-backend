import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidTokenError } from '@/core/errors/errors-message/invalid-token'

import { RefreshAccessTokenUseCase } from '@/domain/core/application/use-cases/refresh-access-token'

import { Cookies } from '@/infra/auth/cookies-decorator'
import { Public } from '@/infra/auth/public'

@Public()
@Controller('/auth/refresh')
export class RefreshAccessTokenController {

  constructor(private refreshAccessToken: RefreshAccessTokenUseCase) { }

  @Post()
  @HttpCode(200)
  async handle(@Cookies('refreshToken') refreshToken: string) {
    const response = await this.refreshAccessToken.execute({
      refreshToken
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidTokenError:
          throw new UnauthorizedException(error.message)
        case ResourceNotFoundError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return response.value
  }
}