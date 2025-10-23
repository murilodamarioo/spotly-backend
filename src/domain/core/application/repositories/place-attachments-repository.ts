import { PlaceAttachment } from '../../enterprise/entities/place-attachment'

export abstract class PlaceAttachmentsRepository {

  /**
   * Finds multiple `PlaceAttachment` entities by the given place ID.
   * 
   * @param {string} id - Unique identifier of the `Place`.
   * @return {Promise<PlaceAttachment[]>} A promise that resolves to an array of `PlaceAttachment` entities.
   */
  abstract findManyByPlaceId(id: string): Promise<PlaceAttachment[]>

  /**
   * Deletes multiple `PlaceAttachment` entities by the given place ID.
   * 
   * @param {string} id - Unique identifier of the `Place`.
   * @return {Promise<void>} A promise that resolves with void after the `PlaceAttachment` entities are deleted.
   */
  abstract deleteManyById(id: string): Promise<void>

}