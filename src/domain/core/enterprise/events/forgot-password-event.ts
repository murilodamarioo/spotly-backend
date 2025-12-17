import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { PasswordResetToken } from '../entities/password-reset-token'

export class ForgotPasswordEvent implements DomainEvent {
  public ocurredAt: Date
  public passwordResetToken: PasswordResetToken

  constructor(passwordResetToken: PasswordResetToken) {
    this.ocurredAt = new Date()
    this.passwordResetToken = passwordResetToken
  }

  getAggregateId(): UniqueEntityId {
    return this.passwordResetToken.id
  }

}