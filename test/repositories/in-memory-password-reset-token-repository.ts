import { DomainEvents } from '@/core/events/domain-events'
import { PasswordResetTokenRepository } from '@/domain/core/application/repositories/password-reset-token-repository'
import { PasswordResetToken } from '@/domain/core/enterprise/entities/password-reset-token'

export class InMemoryPasswordResetTokenRepository implements PasswordResetTokenRepository {

  public resetTokens: PasswordResetToken[] = []

  async create(resetToken: PasswordResetToken): Promise<void> {
    this.resetTokens.push(resetToken)

    DomainEvents.dispatchEventsForAggregate(resetToken.id)
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const resetToken = this.resetTokens.find(
      (resetToken) => resetToken.token === token
    )

    return resetToken ? resetToken : null
  }

  async deleteByUserId(id: string): Promise<void> {
    const resetTokenIndex = this.resetTokens.findIndex(
      (resetToken) => resetToken.id.toString() === id
    )

    this.resetTokens.splice(resetTokenIndex, 1)
  }

} 