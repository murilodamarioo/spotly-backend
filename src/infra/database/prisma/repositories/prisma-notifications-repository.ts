import { Injectable } from '@nestjs/common'

import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

import { PrismaService } from '../prisma.service'

import { PrismaNotificartionMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {

  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id }
    })

    return notification ? PrismaNotificartionMapper.toDomain(notification) : null
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificartionMapper.toPrisma(notification)

    await this.prisma.notification.create({ data })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificartionMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: { id: notification.id.toString() },
      data
    })
  }

}