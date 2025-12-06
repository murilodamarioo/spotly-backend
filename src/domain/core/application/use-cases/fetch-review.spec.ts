import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchReviewsUseCase } from './fetch-review'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryReviewsRepository } from 'test/repositories/in-memory-reviews-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryReviewAttachmentsRepository } from 'test/repositories/in-memory-review-attachments-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { makePlace } from 'test/factories/make-place'
import { makeReview } from 'test/factories/make-review'
import { makeUser } from 'test/factories/make-user'

let inMemoryReviewsRepository: InMemoryReviewsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let inMemoryReviewAttachmentsRepository: InMemoryReviewAttachmentsRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let inMemoryPlaceRepository: InMemoryPlacesRepository
let sut: FetchReviewsUseCase

describe('Fetch Review', () => {
  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )
    inMemoryReviewAttachmentsRepository = new InMemoryReviewAttachmentsRepository()
    inMemoryReviewsRepository = new InMemoryReviewsRepository(
      inMemoryReviewAttachmentsRepository,
      inMemoryUsersRepository
    )
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlaceRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository,
      inMemoryPlaceReactionsRepository
    )

    sut = new FetchReviewsUseCase(inMemoryReviewsRepository)
  })

  it('should be able to fetch reviews', async () => {
    const user = makeUser()
    inMemoryUsersRepository.create(user)

    const place = makePlace()
    await inMemoryPlaceRepository.create(place)

    await inMemoryReviewsRepository.create(
      makeReview({
        reviewerId: user.id,
        placeId: place.id,
        rating: 4,
        comment: 'The Best Place in Town',
        createdAt: new Date(2025, 8, 5)
      })
    )

    await inMemoryReviewsRepository.create(
      makeReview({
        reviewerId: user.id,
        placeId: place.id,
        rating: 3,
        comment: 'Not bad',
        createdAt: new Date(2025, 8, 3)
      })
    )

    await inMemoryReviewsRepository.create(
      makeReview({
        reviewerId: user.id,
        placeId: place.id,
        rating: 5,
        comment: 'Awesome Restaurant',
        createdAt: new Date(2025, 9, 8)
      })
    )

    const response = await sut.execute({
      placeId: place.id.toString(),
      page: 1
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.reviews).toEqual([
      expect.objectContaining({ rating: 5 }),
      expect.objectContaining({ rating: 4 }),
      expect.objectContaining({ rating: 3 })
    ])
  })

  it('should be able to fetch paginated reviews', async () => {
    const user = makeUser()
    inMemoryUsersRepository.create(user)

    for (let i = 1; i <= 22; i++) {
      await inMemoryReviewsRepository.create(
        makeReview({
          placeId: new UniqueEntityId('place-1'),
          reviewerId: user.id
        })
      )
    }

    const response = await sut.execute({
      placeId: 'place-1',
      page: 2
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.reviews).toHaveLength(2)
  })
})