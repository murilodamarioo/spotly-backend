import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PlaceAttachment, PlaceAttachmentProps } from '@/domain/core/enterprise/entities/place-attachment'


export function makePlaceAttachment(override: Partial<PlaceAttachmentProps> = {}, id?: UniqueEntityId): PlaceAttachment {
  const placeAttachment = PlaceAttachment.create({
    attachmentId: new UniqueEntityId(),
    placeId: new UniqueEntityId(),
    ...override
  }, id)

  return placeAttachment
}

// TODO: Implements PlaceFactory