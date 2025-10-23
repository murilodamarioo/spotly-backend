import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {

  /**
   * Persists a new `Attachment` in the repository.
   * 
   * @param {Place} attachment - The `Attachment` to be created.
   * @return {Promise<void>} A promise that resolves when the `Attachment` is successfully created.
   */
  abstract create(attachment: Attachment): Promise<void>

}