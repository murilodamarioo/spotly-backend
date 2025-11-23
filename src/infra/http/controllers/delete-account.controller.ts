import { BadRequestException, Controller, Delete, HttpCode, NotAcceptableException } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { DeleteAccountUseCase } from '@/domain/core/application/use-cases/delete-account'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@ApiBearerAuth('jwt')
@Controller('/users/me')
export class DeleteAccountController {

  constructor(private deleteAccount: DeleteAccountUseCase) { }

  @Delete()
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Account deleted successfully' })
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
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const response = await this.deleteAccount.execute({ userId })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotAcceptableException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}