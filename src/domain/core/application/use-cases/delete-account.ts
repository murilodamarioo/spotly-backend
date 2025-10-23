import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { UsersRepository } from '../repositories/users-repository'

interface DeleteAccountUseCaseRequest {
  userId: string
}

type DeleteAccountUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteAccountUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ userId }: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if(!user) {
      return failure(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(userId)

    return success(null)
  }
}