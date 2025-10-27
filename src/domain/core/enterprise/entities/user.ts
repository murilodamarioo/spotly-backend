import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  password: string
  profilePicture?: string | null
  bio?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get profilePicture() {
    return this.props.profilePicture
  }

  set profilePicture(profilePicture: string | null | undefined) {
    this.props.profilePicture = profilePicture
    this.touch()
  }

  get bio() {
    return this.props.bio
  }

  set bio(bio: string | null | undefined) {
    this.props.bio = bio
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

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityId): User {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return user
  }

}