import { PaginationParam } from '@/core/repositories/pagination-param'

import { Place } from '../../enterprise/entities/place'
import { PlaceDetails } from '../../enterprise/entities/value-objects/place-details'

export abstract class PlacesRepository {

  /**
   * Persists a new `Place` in the repository.
   * 
   * @param {Place} place - The `Place` to be created.
   * @return {Promise<void>} A promise that resolves when the `Place` is successfully created.
   */
  abstract create(place: Place): Promise<void>

  /**
   * Returns a `Place` from the repository.
   * 
   * @param {string} id - Unique identifier of the `Place`.
   * @return {Promise<Place | null>} A promise that resolves to the `Place` entity if found, or null if not found.
   */
  abstract findById(id: string): Promise<Place | null>

  /**
   * Returns a `Place` from the repository.
   * 
   * @param {string} id - Unique identifier of the `Place`.
   * @return {Promise<PlaceDetails | null>} A promise that resolves to the `PlaceDeatils` entity if found, or null if not found.
   */
  abstract findByIdWithDetails(id: string): Promise<PlaceDetails | null>

  /**
   * Finds multiple places based on the provided pagination parameters.
   * 
   * @param {PaginationParam} params - The pagination parameters.
   * @return {Promise<Place[]>} A promise that resolves to an array of `Place` matching the pagination parameters.
   */
  abstract findManyByRecent(params: PaginationParam): Promise<Place[]>

  /**
   * Saves a `Place` in the repository.
   * 
   * @param {Place} place - The `Place` to be saved.
   * @return {Promise<void>} A promise that resolves when the `Place` is successfully saved.
   */
  abstract save(place: Place): Promise<void>

  /**
   * Deletes a `Place` by its ID.
   * 
   * @param {string} id - The ID of the `Place` to be deleted.
   * @returns {Promise<void>} A promise that resolves with void after the `Place` is deleted.
   */
  abstract delete(id: string): Promise<void>
}