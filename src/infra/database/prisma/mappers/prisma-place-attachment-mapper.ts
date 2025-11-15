import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PlaceAttachment } from '@/domain/core/enterprise/entities/place-attachment'

export class PrismaPlaceAttachmentMapper {

  static toDomain(raw: PrismaAttachment): PlaceAttachment {
    if (!raw.placeId) {
      throw new Error('Invalid attachment type')
    }

    return PlaceAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      placeId: new UniqueEntityId(raw.placeId)
    }, new UniqueEntityId(raw.id))
  }

  static toPrismaUpdateMany(attachment: PlaceAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachment.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: { id: { in: attachmentIds } },
      data: { placeId: attachment[0].placeId.toString() }
    }
  }
}