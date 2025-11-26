import { Injectable } from '@nestjs/common'

import { PlaceReaction } from '@/domain/core/enterprise/entities/place-reaction'
import { PlaceReactionsRepository } from '@/domain/core/application/repositories/place-reactions-repository'

import { PrismaService } from '../prisma.service'

import { PrismaPlaceReactionMapper } from '../mappers/prisma-place-reaction-mapper'

@Injectable()
export class PrismaPlaceReactionsRepository implements PlaceReactionsRepository {

  constructor(private prisma: PrismaService) { }

  async findExistingReaction(placeId: string, userId: string): Promise<PlaceReaction | null> {
    const placeReaction = await this.prisma.placeReaction.findFirst({
      where: {
        placeId,
        userId
      }
    })

    return placeReaction ? PrismaPlaceReactionMapper.toDomain(placeReaction) : null
  }

  async create(placeReaction: PlaceReaction): Promise<void> {
    const data = PrismaPlaceReactionMapper.toPrisma(placeReaction)

    await this.prisma.placeReaction.create({
      data
    })
  }

  async save(placeReaction: PlaceReaction): Promise<void> {
    const data = PrismaPlaceReactionMapper.toPrisma(placeReaction)

    await this.prisma.placeReaction.update({
      where: {
        id: placeReaction.id.toString()
      },
      data
    })
  }
}