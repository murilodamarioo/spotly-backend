import { PasswordResetToken } from '../../enterprise/entities/password-reset-token'

export abstract class PasswordResetTokenRepository {

  /**
   * Creates a password reset token for a user and saves it to the database.
   * @param {string} resetToken - The password reset token to create.
   * @return {Promise<void>} A Promise that resolves when the token is created and saved.
   */
  abstract create(resetToken: PasswordResetToken): Promise<void>

  /**
   * Finds a password reset token in the database by its token.
   * @param {string} token - The token to search for.
   * @return {Promise<PasswordResetToken | null>} A Promise that resolves with the token if found, or null if not found.
   */
  abstract findByToken(token: string): Promise<PasswordResetToken | null>

  /**
   * Deletes all password reset tokens associated with a user from the database.
   * @param {string} id - The ID of the user whose tokens should be deleted.
   * @return {Promise<void>} A Promise that resolves when the tokens are deleted.
   */
  abstract deleteByUserId(id: string): Promise<void>

}