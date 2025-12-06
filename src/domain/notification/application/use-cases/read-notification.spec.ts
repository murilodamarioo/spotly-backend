import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )
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