import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification'

import { PrismaNotificartionMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId): Notification {
  return Notification.create({
    recipientId: new UniqueEntityId(),
    title: faker.lorem.sentence({ min: 1, max: 4 }),
    content: faker.lorem.sentence({ min: 1, max: 9 }),
    ...override
  }, id)
}

@Injectable()
export class NotificationFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificartionMapper.toPrisma(notification)
    })

    return notification
  }
}