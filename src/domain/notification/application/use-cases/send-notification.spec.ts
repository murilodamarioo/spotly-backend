import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      recipientId: 'recipient-1',
      title: 'New recomendation',
      content: 'Italian House, it`s a new restaurant'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      notification: expect.objectContaining({
        content: 'Italian House, it`s a new restaurant'
      })
    })
    expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
  })
})