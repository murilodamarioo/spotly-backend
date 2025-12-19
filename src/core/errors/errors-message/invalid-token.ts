import { UseCaseError } from '../use-case-error'

export class InvalidTokenError extends Error implements UseCaseError {
  constructor() {
    super('Invalid token provided')
  }
}