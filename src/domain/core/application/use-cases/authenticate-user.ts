import { InvalidCredentialsError } from '@/core/errors/errors-message'
import { Either, failure, success } from '@/core/either'

import { UsersRepository } from '../repositories/users-repository'
import { Encrypter, HashComparer } from '../cryptography'
import { Injectable } from '@nestjs/common'

interface AuthenticateUserRequest {
  email: string
  password: string
}

type AuthenticateUserResponse = Either<InvalidCredentialsError,
  {
    access_token: string,
    refresh_token: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) { }

  async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return failure(new InvalidCredentialsError())
    }

    const isValidPassword = await this.hashComparer.compare(password, user.password)

    if (!isValidPassword) {
      return failure(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt(
      { sub: user.id.toString() },
      { expiresIn: '30m' }
    )

    const refreshToken = await this.encrypter.encrypt(
      { sub: user.id.toString() },
      { expiresIn: '7d' }
    )

    return success({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }
}