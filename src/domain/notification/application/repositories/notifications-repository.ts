import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {

  /**
   * Finds a notification by ID.
   * 
   * @param {string} id - The ID of the `Notification` to find.
   * @return {Promise<Notification | null>} A promise that resolves to the `Notification` with the given ID, or null if not found.
   */
  abstract findById(id: string): Promise<Notification | null>

  /**
   * Persists a new `Notification` in the repository.
   * 
   * @param {Place} notification - The `Notification` to be created.
   * @return {Promise<void>} A promise that resolves when the `Notification` is successfully created.
   */
  abstract create(notification: Notification): Promise<void>

  /**
   * Saves a `Notification` in the repository.
   * 
   * @param {Notification} notification - The `Notification` to be saved.
   * @return {Promise<void>} A promise that resolves when the `Notification` is successfully saved.
   */
  abstract save(notification: Notification): Promise<void>

}