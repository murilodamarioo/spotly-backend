/**
 * Abstract class representing an encryption service.
 * 
 * Implementations of this class should provide a method to encrypt a given payload.
 */
export abstract class Encrypter {

  /**
   * Encrypts the given payload using a cryptographic algorithm and returns a signed JSON Web Token (JWT).
   *
   * @param {Record<string, unknown>} payload - The data to be encrypted and included in the JWT payload.
   * @param {Object} [options] - Optional configuration options for the encryption process.
   * @param {string | number} [options.expiresIn] - The expiration time for the JWT, specified as a string or number representing the number of seconds until expiration.
   * @returns {Promise<string>} - A Promise that resolves to the encrypted JWT as a string.
   */
  abstract encrypt(payload: Record<string, unknown>, options?: { expiresIn?: string | number }): Promise<string>

  /**
   * Decrypts a JSON Web Token (JWT) using a secret key and returns the decrypted payload as a JavaScript object.
   *
   * @param {string} token - The JWT to be decrypted.
   * @returns {Promise<Record<string, unknown>>} - A Promise that resolves to the decrypted payload as a JavaScript object.
   */
  abstract decrypt(token: string): Promise<Record<string, unknown>>
}