import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository'
import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'

import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository'
import { PrismaPlacesRepository } from './prisma/repositories/prisma-places-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments'
import { PrismaPlaceAttachmentsRepository } from './prisma/repositories/prisma-place-attachments-repository'
import { PrismaReviewsRepository } from './prisma/repositories/prisma-reviews-repository'

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
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository
    },
    {
      provide: PlaceAttachmentsRepository,
      useClass: PrismaPlaceAttachmentsRepository
    },
    {
      provide: ReviewsRepository,
      useClass: PrismaReviewsRepository
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PlacesRepository,
    AttachmentsRepository,
    PlaceAttachmentsRepository,
    ReviewsRepository
  ]
})
export class DatabaseModule { }