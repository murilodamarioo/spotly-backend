import { User } from '@/domain/core/enterprise/entities/user'
import { UsersRepository } from '@/domain/core/application/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id)

    return user ? user : null
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    return user ? user : null
  }

  async create(user: User) {
    this.users.push(user)
  }

  async save(user: User) {
    const userIndex = this.users.findIndex((item) => item.id === user.id)

    this.users[userIndex] = user
  }

  async delete(id: string) {
    const userIndex = this.users.findIndex((user) => user.id.toString() === id)

    this.users.splice(userIndex, 1)
  }
}