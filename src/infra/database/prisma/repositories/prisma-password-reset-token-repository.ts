import { Injectable } from '@nestjs/common'

import { PasswordResetTokenRepository } from '@/domain/core/application/repositories/password-reset-token-repository'
import { PasswordResetToken } from '@/domain/core/enterprise/entities/password-reset-token'

import { PrismaService } from '../prisma.service'

import { PrismaPasswordResetTokenMapper } from '../mappers/prisma-password-reset-token-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {

  constructor(private prisma: PrismaService) { }

  async create(resetToken: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(resetToken)

    await this.prisma.passwordResetToken.create({ data })

    DomainEvents.dispatchEventsForAggregate(resetToken.id)
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token
      }
    })

    return resetToken ? PrismaPasswordResetTokenMapper.toDomain(resetToken) : null
  }

  async deleteByUserId(id: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: id
      }
    })
  }

}