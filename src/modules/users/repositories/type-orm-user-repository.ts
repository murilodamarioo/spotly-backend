import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user-repository.interface'
import { Repository } from 'typeorm';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: {
        email
      }
    })
  }

  async save(user: User): Promise<User> {
    return await this.ormRepository.save(user)
  }

}