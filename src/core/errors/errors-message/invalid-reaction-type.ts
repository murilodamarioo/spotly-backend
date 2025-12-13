import { UseCaseError } from '../use-case-error'

export class InvalidReactionTypeError extends Error implements UseCaseError {
  constructor() {
    super('Invalid reaction type')
  }
}