import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { PlaceAttachmentList } from './place-attachment-list'

import { PlaceReactionsReachedEvent } from '../events/place-reactions-reached-event'

export interface PlaceProps {
  userId: UniqueEntityId
  name: string
  category: string
  description?: string | null
  attachments: PlaceAttachmentList
  address: string
  city: string
  state: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Place extends AggregateRoot<PlaceProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get category() {
    return this.props.category
  }

  set category(category: string) {
    this.props.category = category
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: PlaceAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public notifyReactionsMilestone(reactionsCount: number): void {
    this.addDomainEvent(new PlaceReactionsReachedEvent(this.id, reactionsCount))
  }

  static create(props: Optional<PlaceProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId): Place {
    const place = new Place({
      ...props,
      attachments: props.attachments ?? new PlaceAttachmentList(),
      createdAt: props.createdAt ?? new Date()
    }, id)

    return place
  }
}