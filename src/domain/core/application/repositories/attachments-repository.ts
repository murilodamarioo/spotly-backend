import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {

  /**
   * Persists a new `Attachment` in the repository.
   * 
   * @param {Place} attachment - The `Attachment` to be created.
   * @return {Promise<void>} A promise that resolves when the `Attachment` is successfully created.
   */
  abstract create(attachment: Attachment): Promise<void>

  /**
   * Deletes an `Attachment` from the repository by its unique identifier.
   * 
   * @param {string} id - The unique identifier of the `Attachment` to be deleted.
   * @return {Promise<void>} A promise that resolves when the `Attachment` is successfully deleted.
   */
  abstract delete(id: string): Promise<void>

}