import { PlaceReaction } from '../../enterprise/entities/place-reaction'

export abstract class PlaceReactionsRepository {

  abstract create(placeReaction: PlaceReaction): Promise<void>

  /**
   * Search for a specific reaction record based on the user and the place.
   * @param {string} placeId - The unique identifier of the target place.
   * @param {string} userId - The unique identifier of the user to check.
   * @return {Promise<PlaceReaction | null>} The matching `PlaceReaction` entity, or `null` if the user hasn't reacted to this place yet.
   */
  abstract findExistingReaction(placeId: string, userId: string): Promise<PlaceReaction | null>

  /**
   * Persists or updates a `PlaceReaction` in the repository.
   * * This method handles both the creation of a new reaction and the update
   * of an existing one, ensuring the database reflects the current state 
   * (like, dislike, or neutral).
   * @param {PlaceReaction} placeReaction - The `PlaceReaction` entity to be saved or updated.
   * @return {Promise<void>} A promise that resolves when the operation is successfully completed.
   */
  abstract save(placeReaction: PlaceReaction): Promise<void>

}