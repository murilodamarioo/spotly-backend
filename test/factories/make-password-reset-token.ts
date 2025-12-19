import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PasswordResetToken, PasswordResetTokenProps } from '@/domain/core/enterprise/entities/password-reset-token'
import { faker } from '@faker-js/faker'

export function makePasswordResetToken(
  override: Partial<PasswordResetTokenProps> = {},
  id?: UniqueEntityId
): PasswordResetToken {
  const passwsordResetToken = PasswordResetToken.create({
    userId: new UniqueEntityId(),
    token: faker.string.uuid(),
    expiresAt: faker.date.between({
      from: new Date(),
      to: new Date(Date.now() + 1000 * 2)
    }),
    createdAt: new Date(),
    ...override
  }, id)

  return passwsordResetToken
}