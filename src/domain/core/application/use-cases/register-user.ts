import { Injectable } from '@nestjs/common'

import { UserAlreadyExistsError } from '@/core/errors/errors-message/user-already-exists'
import { Either, failure, success } from '@/core/either'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '../cryptography'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  bio?: string | null
}

type RegisterUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

@Injectable()
export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository, private hashGenerator: HashGenerator) { }

  async execute({
    name,
    email,
    password,
    bio
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      bio
    })

    await this.usersRepository.create(user)

    return success({ user })
  }
}