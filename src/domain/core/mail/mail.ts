import { Message } from '@/core/types/message'

export abstract class Mail {
  
  /**
   * Sends an email message using the provided message object.
   *
   * @param {Message} message - The message object containing the email details.
   * @return {Promise<void>} A promise that resolves when the email is successfully sent.
   */
  abstract sendMail(message: Message): Promise<void>

}