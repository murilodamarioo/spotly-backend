import { Prisma, Place as PrismaPlace } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Place } from '@/domain/core/enterprise/entities/place'

export class PrismaPlaceMapper {

  static toDomain(raw: PrismaPlace): Place {
    return Place.create({
      userId: new UniqueEntityId(raw.userId),
      name: raw.name,
      category: raw.category,
      description: raw.description,
      address: raw.address,
      city: raw.city,
      state: raw.state,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(place: Place): Prisma.PlaceUncheckedCreateInput {
    return {
      id: place.id.toString(),
      userId: place.userId.toString(),
      name: place.name,
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt
    }
  }
  
}