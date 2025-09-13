import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.email
      }
    })

    if (existingUser) {
      throw new ConflictException('Email already registered')
    }

    const user = this.userRepository.create(data)
    
    return this.userRepository.save(user)
  }
}
