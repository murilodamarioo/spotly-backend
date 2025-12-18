import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { Encrypter } from '../cryptography'
import { UsersRepository } from '../repositories/users-repository'
import { PasswordResetTokenRepository } from '../repositories/password-reset-token-repository'
import { PasswordResetToken } from '../../enterprise/entities/password-reset-token'

interface SendForgotPasswrodMailUseCase {
  email: string
}

type SendForgotPasswrodMailUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetToken: PasswordResetTokenRepository,
    private encrypter: Encrypter
  ) { }

  async execute({ email }: SendForgotPasswrodMailUseCase): Promise<SendForgotPasswrodMailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    await this.passwordResetToken.deleteByUserId(user.id.toString())

    const token = await this.encrypter.encrypt({
      sub: user.id.toString(),
      hash: user.password.substring(0, 10)
    })

    const expiresInOneHour = new Date(Date.now() + 1000 * 60 * 60)

    const resetToken = PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt: expiresInOneHour
    })

    await this.passwordResetToken.create(resetToken)

    return success(null)
  }
}