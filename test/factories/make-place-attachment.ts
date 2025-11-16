import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PlaceAttachment, PlaceAttachmentProps } from '@/domain/core/enterprise/entities/place-attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'


export function makePlaceAttachment(override: Partial<PlaceAttachmentProps> = {}, id?: UniqueEntityId): PlaceAttachment {
  const placeAttachment = PlaceAttachment.create({
    attachmentId: new UniqueEntityId(),
    placeId: new UniqueEntityId(),
    ...override
  }, id)

  return placeAttachment
}

@Injectable()
export class PlaceAttachmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaPlaceAttachment(data: Partial<PlaceAttachmentProps> = {}): Promise<PlaceAttachment> {
    const placeAttachment = makePlaceAttachment(data)

    await this.prisma.attachment.update({
      where: { id: placeAttachment.attachmentId.toString() },
      data: {
        placeId: placeAttachment.placeId.toString()
      }
    })

    return placeAttachment
  }
}