import { Prisma, PasswordResetToken as PrismaPasswordResetToken } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PasswordResetToken } from '@/domain/core/enterprise/entities/password-reset-token'

export class PrismaPasswordResetTokenMapper {

  static toDomain(raw: PrismaPasswordResetToken): PasswordResetToken {
    return PasswordResetToken.create({
      userId: new UniqueEntityId(raw.userId),
      token: raw.token,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(resetToken: PasswordResetToken): Prisma.PasswordResetTokenUncheckedCreateInput {
    return {
      id: resetToken.id.toString(),
      token: resetToken.token,
      userId: resetToken.userId.toString(),
      expiresAt: resetToken.expiresAt,
      createdAt: resetToken.createdAt
    }
  }
}