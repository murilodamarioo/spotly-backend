import { PlaceAttachment } from '../../enterprise/entities/place-attachment'

export abstract class PlaceAttachmentsRepository {

  /**
   * Persists multiple `PlaceAttachment` entities in the repository.
   * 
   * @param {PlaceAttachment[]} attachments - An array of `PlaceAttachment` entities to be created.
   * @return {Promise<void>} A promise that resolves when the `PlaceAttachment` entities are successfully created.
   */
  abstract createMany(attachments: PlaceAttachment[]): Promise<void>

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