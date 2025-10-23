import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/core/enterprise/entities/user'

import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId): User {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bio: faker.lorem.sentence(),
    ...override
  }, id)

  return user
}

// TODO: Implements UserFactory