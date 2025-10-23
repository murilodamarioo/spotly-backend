import { UseCaseError } from "../use-case-error";

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('email/password is incorrect.')
  }
}