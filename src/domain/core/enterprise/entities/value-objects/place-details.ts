import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Attachment } from '../attachment'

interface PlaceDetailsProps {
  placeId: UniqueEntityId
  userId: UniqueEntityId
  name: string
  category: string
  description?: string | null
  address: string
  city: string
  state: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class PlaceDetails extends ValueObject<PlaceDetailsProps> {

  get placeId() {
    return this.props.placeId
  }

  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  get category() {
    return this.props.category
  }

  get description() {
    return this.props.description
  }

  get address() {
    return this.props.address
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: PlaceDetailsProps) {
    return new PlaceDetails(props)
  }
}