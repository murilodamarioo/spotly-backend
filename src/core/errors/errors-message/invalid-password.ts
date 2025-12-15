import { UseCaseError } from '../use-case-error'

export class InvalidPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Old password does not match with the current password')
  }
}