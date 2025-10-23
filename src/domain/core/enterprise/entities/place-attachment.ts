import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface PlaceAttachmentProps {
  placeId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class PlaceAttachment extends Entity<PlaceAttachmentProps> {
  get placeId() {
    return this.props.placeId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: PlaceAttachmentProps, id?: UniqueEntityId): PlaceAttachment {
    const placeAttachment = new PlaceAttachment(props, id)

    return placeAttachment
  }
}