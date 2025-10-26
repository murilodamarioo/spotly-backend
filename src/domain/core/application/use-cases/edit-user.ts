import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError, UserAlreadyExistsError } from '@/core/errors/errors-message'

import { UsersRepository } from '../repositories/users-repository'

interface EditUserUseCaseRequest {
  userId: string
  name: string
  email: string
  bio?: string | null
}

type EditUserUseCaseResponse = Either<UserAlreadyExistsError, null>

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    name,
    email,
    bio
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return failure(new UserAlreadyExistsError())
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

    user.name = name
    user.email = email
    user.bio = bio

    await this.usersRepository.save(user)

    return success(null)
  }
}