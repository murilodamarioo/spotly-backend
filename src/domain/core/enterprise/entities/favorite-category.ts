import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class FavoriteCategoryProps {
  categoryId: UniqueEntityId
  userId: UniqueEntityId
}

export class FavoriteCategory extends Entity<FavoriteCategoryProps> {
  get categoryId() {
    return this.props.categoryId
  }

  get userId() {
    return this.props.userId
  }

  static create(props: FavoriteCategoryProps, id?: UniqueEntityId): FavoriteCategory {
    return new FavoriteCategory(props, id)
  }
}