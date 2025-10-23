import { MockInstance } from 'vitest'

import { OnReviewCreated } from './on-review-created'

import { SendNotificationUseCase } from '../use-cases/send-notification'

import { InMemoryReviewsRepository } from 'test/repositories/in-memory-reviews-repository'
import { InMemoryReviewAttachmentsRepository } from 'test/repositories/in-memory-review-attachments-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { makePlace } from 'test/factories/make-place'
import { makeReview } from 'test/factories/make-review'

import { waitFor } from 'test/utils/wait.for'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlacesAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let inMemoryReviewsRepository: InMemoryReviewsRepository
let inMemoryReviewsAttachmentsRepository: InMemoryReviewAttachmentsRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance

describe('On review created', () => {
  beforeEach(() => {
    inMemoryPlacesAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlacesAttachmentsRepository
    )
    inMemoryReviewsAttachmentsRepository = new InMemoryReviewAttachmentsRepository()
    inMemoryReviewsRepository = new InMemoryReviewsRepository(
      inMemoryReviewsAttachmentsRepository
    )
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnReviewCreated(
      inMemoryPlacesRepository,
      sendNotificationUseCase
    )
  })

  it('should send a notification when an answer is created', async () => {
    const place = makePlace()
    await inMemoryPlacesRepository.create(place)

    const review = makeReview({ placeId: place.id })
    await inMemoryReviewsRepository.create(review)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})