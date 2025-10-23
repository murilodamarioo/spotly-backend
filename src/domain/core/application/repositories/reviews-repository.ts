import { PaginationParam } from '@/core/repositories/pagination-param'

import { Review } from '../../enterprise/entities/review'

export abstract class ReviewsRepository {

  /**
   * Returns a `Review` from the repository.
   * 
   * @param {string} id - Unique identifier of the `Review`.
   * @return {Promise<Review | null>} A promise that resolves to the `Review` entity if found, or null if not found.
   */
  abstract findById(id: string): Promise<Review | null>

  /**
   * Finds multiple reviews based on the provided pagination parameters.
   * 
   * @param {PaginationParam} params - The pagination parameters.
   * @return {Promise<Place[]>} A promise that resolves to an array of `Reviews` matching the pagination parameters.
   */
  abstract findManyByPlaceId(id: string, params: PaginationParam): Promise<Review[]>

  /**
   * Persists a new `Review` in the repository.
   * 
   * @param {Review} review - The `Review` to be created.
   * @return {Promise<void>} A promise that resolves when the `Review` is successfully created.
   */
  abstract create(review: Review): Promise<void>

  /**
   * Deletes a `Review` by its ID.
   * 
   * @param {string} id - The ID of the `Review` to be deleted.
   * @returns {Promise<void>} A promise that resolves with void after the `Review` is deleted.
   */
  abstract delete(id: string): Promise<void>

}