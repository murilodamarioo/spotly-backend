import { User } from '../../enterprise/entities/user'

export abstract class UsersRepository {

  /**
   * Finds a user by ID.
   * 
   * @param {string} id - The ID of the `User` to find.
   * @return {Promise<User | null>} A promise that resolves to the `User` with the given ID, or null if not found.
   */
  abstract findById(id: string): Promise<User | null>

  /**
   * Finds a user by email.
   * 
   * @param {string} email - The email of the `User` to find.
   * @return {Promise<User | null>} A promise that resolves to the `User` with the given email, or null if not found.
   */
  abstract findByEmail(email: string): Promise<User | null>

  /**
   * Persists a new `User` in the repository.
   * 
   * @param {User} user - The `User` to create.
   * @return {Promise<void>} A promise that resolves when the `User` is successfully created.
   */
  abstract create(user: User): Promise<void>

  /**
   * Saves a `User` in the repository.
   * 
   * @param {User} user - The `User` to be saved.
   * @return {Promise<void>} A promise that resolves when the `User` is successfully saved.
   */
  abstract save(user: User): Promise<void>

  /**
   * Deletes an `User` by its ID.
   * 
   * @param {string} id - The ID of the `User` to be deleted.
   * @returns {Promise<void>} A promise that resolves with void after the `User` is deleted.
   */
  abstract delete(id: string): Promise<void>
}