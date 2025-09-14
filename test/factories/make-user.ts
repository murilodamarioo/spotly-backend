import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '@/modules/users/entities/user.entity'

import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<User> = {}) {
  const user = new User()

  user.name = faker.person.fullName()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  user.bio = faker.person.bio()

  return Object.assign(user, override)
}

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(User)
    private readonly orm: Repository<User>
  ) { }

  async makeOrmUser(data: Partial<User> = {}): Promise<User> {
    const user = makeUser()

    await this.orm.save(user)

    return user
  }
}