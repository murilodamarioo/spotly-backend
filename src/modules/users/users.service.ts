import { Injectable } from '@nestjs/common'

import { UserEmailAlreadyExistsError } from '@/commons/errors/application-errors/user-email-already-exists'

import { IUserRepository } from './repositories/user-repository.interface'

import { HashGenerator } from '../cryptography/hash-generator'

import { User } from './entities/user.entity'
import { CreateUserRequest, CreateUserResponse } from './dto/create-user.dto'

import { failure, success, } from 'src/shared/either'


@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGenerator: HashGenerator
  ) { }

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      return failure(new UserEmailAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(data.password)

    const user = await this.userRepository.save({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      bio: data.bio
    })

    return success({ user })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email)

    return user
  }
}
