import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidTokenError } from '@/core/errors/errors-message/invalid-token'
import { ExpiredTokenError } from '@/core/errors/errors-message/expired-token'

import { UsersRepository } from '../repositories/users-repository'
import { PasswordResetTokenRepository } from '../repositories/password-reset-token-repository'

import { HashGenerator } from '../cryptography'

interface ResetPasswordUseCaseRequest {
  token: string
  newPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTokenError | ExpiredTokenError,
  null
>

export class ResetPasswordUseCase {

  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokenRepository: PasswordResetTokenRepository,
    private hashGenerator: HashGenerator
  ) { }

  async execute({
    token,
    newPassword
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const resetToken = await this.passwordResetTokenRepository.findByToken(token)

    if (!resetToken) {
      return failure(new InvalidTokenError())
    }

    if (!resetToken.isValid()) {
      return failure(new ExpiredTokenError())
    }

    const user = await this.usersRepository.findById(resetToken.userId.toString())

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const newHashedPassword = await this.hashGenerator.hash(newPassword)
    user.password = newHashedPassword

    await this.usersRepository.save(user)

    await this.passwordResetTokenRepository.deleteByUserId(user.id.toString())

    return success(null)
  }
}