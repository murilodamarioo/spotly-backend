import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidTokenError } from '@/core/errors/errors-message/invalid-token'

import { UsersRepository } from '../repositories/users-repository'

import { Encrypter } from '../cryptography'

interface RefreshAccessTokenRequest {
  refreshToken: string
}

type RefreshAccessTokenResponse = Either<
  ResourceNotFoundError | InvalidTokenError,
  { access_token: string; refresh_token: string }
>

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) { }

  async execute({
    refreshToken,
  }: RefreshAccessTokenRequest): Promise<RefreshAccessTokenResponse> {
    const payload = await this.encrypter.decrypt(refreshToken)

    if (!payload) {
      return failure(new InvalidTokenError())
    }

    const userId = payload.sub as string
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const accessToken = await this.encrypter.encrypt(
      { sub: user.id.toString() },
      { expiresIn: '15m' },
    )

    const newRefreshToken = await this.encrypter.encrypt(
      { sub: user.id.toString() },
      { expiresIn: '7d' },
    )

    return success({
      access_token: accessToken,
      refresh_token: newRefreshToken,
    })
  }
}