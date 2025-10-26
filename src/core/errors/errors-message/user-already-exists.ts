import { UseCaseError } from '../use-case-error';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('User already exists with the same e-mail')
  }
}