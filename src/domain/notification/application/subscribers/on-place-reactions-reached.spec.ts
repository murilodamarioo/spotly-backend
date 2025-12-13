import { MockInstance } from 'vitest'

import { ReactionType } from '@/core/enums/reaction-type'

import { TogglePlaceReactionUseCase } from '@/domain/core/application/use-cases/toggle-place-reaction'

import { OnPlaceReactionsReached } from './on-place-reactions-reached'

import { SendNotificationUseCase } from '../use-cases/send-notification'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'

import { FakeMailService } from 'test/mail/fake-mail-service'

import { makePlace } from 'test/factories/make-place'
import { makeUser } from 'test/factories/make-user'
import { waitFor } from 'test/utils/wait.for'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let inMemoryPlaceAttahcmentsRepository: InMemoryPlaceAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: TogglePlaceReactionUseCase

let sendNotificationExecuteSpy: MockInstance
let fakeMailService: FakeMailService

describe('On place reactions reached', () => {

  beforeEach(() => {

    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )

    inMemoryPlaceAttahcmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttahcmentsRepository,
      inMemoryPlaceReactionsRepository
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    fakeMailService = new FakeMailService()

    sut = new TogglePlaceReactionUseCase(
      inMemoryPlaceReactionsRepository,
      inMemoryPlacesRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnPlaceReactionsReached(
      inMemoryPlacesRepository,
      inMemoryUsersRepository,
      sendNotificationUseCase,
      fakeMailService
    )
  })

  it('should send a notification when a place is reached 100 likes', async () => {
    const place = makePlace()
    await inMemoryPlacesRepository.create(place)

    for (let i = 0; i < 110; i++) {
      const user = makeUser()
      await inMemoryUsersRepository.create(user)

      await sut.execute({
        placeId: place.id.toString(),
        userId: user.id.toString(),
        reactionType: ReactionType.LIKE
      })
    }

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledOnce()
    })
  })

  it('should send two notifications when a place is reached 200 likes', async () => {
    const place = makePlace()
    await inMemoryPlacesRepository.create(place)

    for (let i = 0; i < 210; i++) {
      const user = makeUser()
      await inMemoryUsersRepository.create(user)

      await sut.execute({
        placeId: place.id.toString(),
        userId: user.id.toString(),
        reactionType: ReactionType.LIKE
      })
    }

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledTimes(2)
    })
  })
})