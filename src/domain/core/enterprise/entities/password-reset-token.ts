import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ForgotPasswordEvent } from '../events/forgot-password-event'

export interface PasswordResetTokenProps {
  userId: UniqueEntityId
  token: string
  expiresAt: Date
  createdAt: Date
}

export class PasswordResetToken extends AggregateRoot<PasswordResetTokenProps> {

  get userId() {
    return this.props.userId
  }

  get token() {
    return this.props.token
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  public isValid() {
    return new Date() < this.props.expiresAt
  }

  static create(
    props: Optional<PasswordResetTokenProps, 'createdAt'>,
    id?: UniqueEntityId
  ): PasswordResetToken {
    const passwordResetToken = new PasswordResetToken({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    const isNewToken = !id

    if (isNewToken) {
      passwordResetToken.addDomainEvent(
        new ForgotPasswordEvent(passwordResetToken)
      )
    }

    return passwordResetToken
  }
}