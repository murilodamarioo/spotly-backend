import { GetReviewUseCase } from './get-review'

import { InMemoryReviewsRepository } from 'test/repositories/in-memory-reviews-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryReviewAttachmentsRepository } from 'test/repositories/in-memory-review-attachments-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { makeReview } from 'test/factories/make-review'
import { makeUser } from 'test/factories/make-user'

let inMemoryReviewsRepository: InMemoryReviewsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryReviewAttachmentsRepository: InMemoryReviewAttachmentsRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let sut: GetReviewUseCase

describe('Get Review', () => {

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
    
    sut = new GetReviewUseCase(inMemoryReviewsRepository)
  })

  it('should be able to get a review with valid id', async () => {
    const reviewer = makeUser()
    await inMemoryUsersRepository.create(reviewer)

    const review = makeReview({
      reviewerId: reviewer.id
    })
    await inMemoryReviewsRepository.create(review)

    const response = await sut.execute({
      reviewId: review.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      review: expect.objectContaining({
        rating: review.rating,
        comment: review.comment
      })
    })
  })
})