import { Prisma, PlaceReaction as PrismaPlaceReaction } from '@prisma/client'

import { PlaceReaction } from '@/domain/core/enterprise/entities/place-reaction'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaPlaceReactionMapper {

  static toDomain(raw: PrismaPlaceReaction): PlaceReaction {
    return PlaceReaction.create({
      placeId: new UniqueEntityId(raw.placeId),
      userId: new UniqueEntityId(raw.userId),
      like: raw.like,
      dislike: raw.dislike,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(placeReaction: PlaceReaction): Prisma.PlaceReactionUncheckedCreateInput {
    return {
      id: placeReaction.id.toString(),
      placeId: placeReaction.placeId.toString(),
      userId: placeReaction.userId.toString(),
      like: placeReaction.like,
      dislike: placeReaction.dislike,
      createdAt: placeReaction.createdAt,
      updatedAt: placeReaction.updatedAt
    }
  }
}