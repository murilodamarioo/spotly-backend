import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification'

import { faker } from '@faker-js/faker'

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId): Notification {
  return Notification.create({
    recipientId: new UniqueEntityId(),
    title: faker.lorem.sentence({ min: 1, max: 4 }),
    content: faker.lorem.sentence({ min: 1, max: 9 }),
    ...override
  }, id)
}

// TODO: Implements PlaceFactory