import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'

import { PrismaUsersRepository } from './prisma/repositpries/prisma-user-repository'
import { PrismaPlacesRepository } from './prisma/repositpries/prisma-places-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },
    {
      provide: PlacesRepository,
      useClass: PrismaPlacesRepository
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PlacesRepository
  ]
})
export class DatabaseModule { }