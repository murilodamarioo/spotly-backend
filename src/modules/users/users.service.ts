import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEmailAlreadyExistsError } from 'src/commons/errors/application-errors/user-email-already-exists'

import { User } from './entities/user.entity'

import { failure, success, } from 'src/shared/either'
import { CreateUserRequest, CreateUserResponse } from './dto/create-user.dto'


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.email
      }
    })

    if (existingUser) {
      return failure(new UserEmailAlreadyExistsError())
    }

    const user = this.userRepository.create(data)

    await this.userRepository.save(user)

    return success({ user })
  }
}
