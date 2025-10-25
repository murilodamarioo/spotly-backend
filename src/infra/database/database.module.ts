import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'

import { PrismaUsersRepository } from './prisma/repositpries/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    }
  ],
  exports: [
    PrismaService,
    UsersRepository
  ]
})
export class DatabaseModule { }