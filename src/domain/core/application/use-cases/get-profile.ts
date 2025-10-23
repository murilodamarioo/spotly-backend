import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  userId: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, { profile: User }>

export class GetProfileUseCase {
  constructor(private usersRespository: UsersRepository) { }

  async execute({ userId }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRespository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    return success({ profile: user })
  }
}