import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface CategoryProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static created(props: Optional<CategoryProps, 'createdAt'>, id?: UniqueEntityId): Category {
    return new Category({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)
  }
}