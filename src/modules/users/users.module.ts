import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IUserRepository } from './repositories/user-repository.interface';
import { TypeOrmUserRepository } from './repositories/type-orm-user-repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository
    }
  ],
  controllers: [UsersController]
})
export class UsersModule { }