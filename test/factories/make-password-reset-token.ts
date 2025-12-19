import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PasswordResetToken, PasswordResetTokenProps } from '@/domain/core/enterprise/entities/password-reset-token'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPasswordResetTokenMapper } from '@/infra/database/prisma/mappers/prisma-password-reset-token-mapper'

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

@Injectable()
export class PasswordResetTokenFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaReview(data: Partial<PasswordResetTokenProps> = {}): Promise<PasswordResetToken> {
    const passwordResetToken = makePasswordResetToken(data)

    await this.prisma.passwordResetToken.create({
      data: PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken)
    })

    return passwordResetToken
  }
}