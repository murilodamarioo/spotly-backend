import { Optional } from '@/commons/types/optinal';
import { User } from '../entities/user.entity'

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>

  abstract save(user: Optional<User, | 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
}