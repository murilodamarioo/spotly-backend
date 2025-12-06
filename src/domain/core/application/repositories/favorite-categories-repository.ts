import { FavoriteCategory } from '../../enterprise/entities/favorite-category'

export abstract class FavoriteCategoriesRepository {

  /**
   * Creates multiple favorite categories in the repository.
   *
   * @param {FavoriteCategory[]} categories - An array of favorite categories to be created.
   * @return {Promise<void>} A promise that resolves when the favorite categories are successfully created.
   */
  abstract createMany(categories: FavoriteCategory[]): Promise<void>

}