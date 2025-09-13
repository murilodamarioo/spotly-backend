import { UserEmailAlreadyExistsError } from 'src/commons/errors/application-errors/user-email-already-exists'
import { User } from '../entities/user.entity'
import { Either } from 'src/shared/either'

export class CreateUserRequest {
  name: string
  email: string
  password: string
  bio?: string
}

export type CreateUserResponse = Either<UserEmailAlreadyExistsError, { user: User }>