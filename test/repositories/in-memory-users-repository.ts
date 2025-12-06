import { User } from '@/domain/core/enterprise/entities/user'
import { UsersRepository } from '@/domain/core/application/repositories/users-repository'

import { InMemoryFavoriteCategoriesRepository } from './in-memory-favorite-categories-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  constructor(private favoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository) { }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id)

    return user ? user : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    return user ? user : null
  }

  async create(user: User): Promise<void> {
    this.users.push(user)

    await this.favoriteCategoriesRepository.createMany(
      user.favoriteCategories.getItems()
    )
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex((item) => item.id === user.id)

    this.users[userIndex] = user
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id.toString() === id)

    this.users.splice(userIndex, 1)
  }
}