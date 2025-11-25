import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface PlaceReactionProps {
  placeId: UniqueEntityId
  userId: UniqueEntityId
  like?: boolean | null
  dislike?: boolean | null
  createdAt?: Date
  updatedAt?: Date
}

export class PlaceReaction extends Entity<PlaceReactionProps> {
  get placeId() {
    return this.props.placeId
  }

  get userId() {
    return this.props.userId
  }

  get like() {
    return this.props.like
  }

  get dislike() {
    return this.props.dislike
  }

  public toggleLike() {
    if (this.props.like) {
      this.props.like = null
      this.props.dislike = null
    } else {
      this.props.like = true
      this.props.dislike = null
    }
    this.touch()
  }

  public toggleDislike() {
    if (this.props.dislike) {
      this.props.dislike = null
      this.props.like = null
    } else {
      this.props.dislike = true
      this.props.like = null
    }
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<PlaceReactionProps, 'createdAt'>, id?: UniqueEntityId): PlaceReaction {
    return new PlaceReaction({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)
  }
}