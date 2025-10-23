import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { exec } from 'child_process'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const recipient = makeUser()
    await inMemoryUsersRepository.create(recipient)

    const notification = makeNotification({ recipientId: recipient.id })
    await inMemoryNotificationsRepository.create(notification)

    const response = await sut.execute({
      recipientId: recipient.id.toString(),
      notificationId: notification.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      notification: expect.objectContaining({
        readAt: expect.any(Date)
      })
    })
  })
})