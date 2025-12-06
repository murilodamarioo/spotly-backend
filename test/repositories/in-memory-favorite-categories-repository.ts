import { FavoriteCategoriesRepository } from '@/domain/core/application/repositories/favorite-categories-repository'
import { FavoriteCategory } from '@/domain/core/enterprise/entities/favorite-category'

export class InMemoryFavoriteCategoriesRepository implements FavoriteCategoriesRepository {

  public categories: FavoriteCategory[] = []

  async createMany(categories: FavoriteCategory[]): Promise<void> {
    this.categories.push(...categories)
  }

}