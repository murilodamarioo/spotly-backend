import { UseCaseError } from '../use-case-error'

export class ExpiredTokenError extends Error implements UseCaseError {
  constructor() {
    super('Access token expired')
  }
}