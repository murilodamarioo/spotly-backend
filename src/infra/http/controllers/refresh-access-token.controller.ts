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
import { ApiCookieAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

@ApiTags('authentication')
@Public()
@Controller('/auth/refresh')
export class RefreshAccessTokenController {

  constructor(private refreshAccessToken: RefreshAccessTokenUseCase) { }

  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    schema: {
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Invalid token provided' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 }
      }
    }
  })
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