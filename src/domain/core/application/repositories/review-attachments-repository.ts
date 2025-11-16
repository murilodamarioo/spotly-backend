import { ReviewAttachment } from '../../enterprise/entities/review-attachment'

export abstract class ReviewAttachmentsRepository {

  /**
   * Persists multiple `ReviewAttachment` entities in the repository.
   * 
   * @param {ReviewAttachment[]} attachments - An array of `ReviewAttachment` entities to be created.
   * @return {Promise<void>} A promise that resolves when the `ReviewAttachment` entities are successfully created.
   */
  abstract createMany(attachments: ReviewAttachment[]): Promise<void>

  /**
   * Finds multiple `ReviewAttachment` entities by the given review ID.
   * 
   * @param {string} id - Unique identifier of the `Review`.
   * @return {Promise<ReviewAttachment[]>} A promise that resolves to an array of `ReviewAttachment` entities.
   */
  abstract findManyByReviewId(id: string): Promise<ReviewAttachment[]>

  /**
   * Deletes multiple `ReviewAttachment` entities.
   * 
   * @param {ReviewAttachment[]} attachments - An array of `ReviewAttachment` entities to be deleted.
   * @return {Promise<void>} A promise that resolves with void after the `ReviewAttachment` entities are deleted.
   */
  abstract deleteMany(attachments: ReviewAttachment[]): Promise<void>

  /**
   * Deletes multiple `ReviewAttachment` entities by the given review ID.
   * 
   * @param {string} id - Unique identifier of the `Review`.
   * @return {Promise<void>} A promise that resolves with void after the `ReviewAttachment` entities are deleted.
   */
  abstract deleteManyById(id: string): Promise<void>
}