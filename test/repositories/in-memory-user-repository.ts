import { IUserRepository } from '@/modules/users/repositories/user-repository.interface'
import { User } from 'src/modules/users/entities/user.entity'

export class InMemoryUserRespository implements IUserRepository {
  public users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email)

    return user ? user : null
  }

  async save(user: User): Promise<User> {
  const userIndex = this.users.findIndex(u => u.id === user.id)

  if (userIndex === -1) {
    this.users.push(user) // Insere se não existe
  } else {
    this.users[userIndex] = user // Atualiza se já existe
  }
  return user
}
}