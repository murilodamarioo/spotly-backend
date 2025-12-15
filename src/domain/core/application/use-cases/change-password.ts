import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { InvalidPasswordError } from '@/core/errors/errors-message/invalid-password'
import { Either, failure, success } from '@/core/either'

import { UsersRepository } from '../repositories/users-repository'
import { HashComparer, HashGenerator } from '../cryptography'

interface ChangePasswordUseCaseRequest {
  userId: string
  oldPassword: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidPasswordError,
  null
>

@Injectable()
export class ChangePasswordUseCase {

  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator
  ) { }

  async execute({
    userId,
    oldPassword,
    newPassword
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    const isValidPassword = await this.hashComparer.compare(oldPassword, user.password)

    if (!isValidPassword) {
      return failure(new InvalidPasswordError())
    }

    const newHashedPassword = await this.hashGenerator.hash(newPassword)

    user.password = newHashedPassword

    await this.usersRepository.save(user)

    return success(null)
  }
}