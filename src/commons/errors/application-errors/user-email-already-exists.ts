import { ServiceError } from '../service-error'

export class UserEmailAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super('Email already registered');
  }
}