import { WatchedList } from '@/core/entities/watched-list'

import { FavoriteCategory } from './favorite-category'

export class FavoriteCategoryList extends WatchedList<FavoriteCategory> {

  compareItems(a: FavoriteCategory, b: FavoriteCategory): boolean {
    return a.categoryId.equals(b.categoryId)
  }
  
}