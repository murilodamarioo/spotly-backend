import { ResourceNotFoundError } from '@/core/errors/errors-message'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CreateReviewUseCase } from './create-review'

import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryReviewAttachmentsRepository } from 'test/repositories/in-memory-review-attachments-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'
import { InMemoryReviewsRepository } from 'test/repositories/in-memory-reviews-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { makeUser } from 'test/factories/make-user'
import { makePlace } from 'test/factories/make-place'


let sut: CreateReviewUseCase
let inMemoryReviewAttachmentsRepository: InMemoryReviewAttachmentsRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository

let inMemoryReviewsRepository: InMemoryReviewsRepository
let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository

describe('Create Review', () => {
  beforeEach(() => {
    inMemoryReviewAttachmentsRepository = new InMemoryReviewAttachmentsRepository()
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryReviewsRepository = new InMemoryReviewsRepository(
      inMemoryReviewAttachmentsRepository,
      inMemoryUsersRepository
    )
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository,
      inMemoryPlaceReactionsRepository
    )
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )
    
    sut = new CreateReviewUseCase(
      inMemoryReviewsRepository,
      inMemoryPlacesRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to create a review', async () => {
    const user = makeUser()
    inMemoryUsersRepository.users.push(user)

    const place = makePlace()
    inMemoryPlacesRepository.places.push(place)

    const response = await sut.execute({
      rating: 5,
      comment: 'So Good!',
      placeId: place.id.toString(),
      reviewerId: user.id.toString(),
      attachmentsIds: ['1', '2']
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toEqual({
      review: inMemoryReviewsRepository.reviews[0]
    })
    expect(inMemoryReviewAttachmentsRepository.attachments[0]).toEqual(
      expect.objectContaining({
        attachmentId: new UniqueEntityId('1')
      })
    )
  })

  it('should not be able to create a review', async () => {
    const user = makeUser()
    inMemoryUsersRepository.users.push(user)

    const response = await sut.execute({
      rating: 5,
      comment: 'So Good!',
      placeId: 'invalid-place-id',
      reviewerId: user.id.toString(),
      attachmentsIds: []
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})