export abstract class ReviewAttachmentsRepository {

  /**
   * Deletes multiple `ReviewAttachment` entities by the given place ID.
   * 
   * @param {string} id - Unique identifier of the `Review`.
   * @return {Promise<void>} A promise that resolves with void after the `ReviewAttachment` entities are deleted.
   */
  abstract delete(id: string): Promise<void>
}