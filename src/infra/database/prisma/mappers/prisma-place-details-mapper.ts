import { Place as PrismaPlace, Attachment as PrismaAttachment } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PlaceDetails } from '@/domain/core/enterprise/entities/value-objects/place-details'

import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaPlaceDetails = PrismaPlace & {
  attachments: PrismaAttachment[]
}

export class PrismaPlaceDetailsMapper {

  static toDomain(raw: PrismaPlaceDetails): PlaceDetails {
    return PlaceDetails.create({
      placeId: new UniqueEntityId(raw.id),
      userId: new UniqueEntityId(raw.userId),
      name: raw.name,
      category: raw.category,
      description: raw.description,
      address: raw.address,
      city: raw.city,
      state: raw.state,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}