import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/modules/users/entities/user.entity'
import { UserFactory } from 'test/factories/make-user'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserFactory],
  exports: [UserFactory],
})
export class UserFactoryModule {}