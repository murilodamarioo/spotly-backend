import { Injectable } from '@nestjs/common'

import { UserEmailAlreadyExistsError } from 'src/commons/errors/application-errors/user-email-already-exists'
import { failure, success, } from 'src/shared/either'
import { CreateUserRequest, CreateUserResponse } from './dto/create-user.dto'
import { IUserRepository } from './repositories/user-repository.interface'


@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: IUserRepository
  ) { }

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      return failure(new UserEmailAlreadyExistsError())
    }

    const user = await this.userRepository.save(data)

    return success({ user })
  }
}
