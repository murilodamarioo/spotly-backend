import { NotAllowedError } from '@/core/errors/errors-message'

import { DeleteReviewUseCase } from './delete-review'

import { InMemoryReviewAttachmentsRepository } from 'test/repositories/in-memory-review-attachments-repository'
import { InMemoryReviewsRepository } from 'test/repositories/in-memory-reviews-repository'

import { makeReview } from 'test/factories/make-review'

let inMemoryReviewAttachmentsRepository: InMemoryReviewAttachmentsRepository
let inMemoryReviewRepository: InMemoryReviewsRepository
let sut: DeleteReviewUseCase

describe('Delete Review', () => {
  beforeEach(() => {
    inMemoryReviewAttachmentsRepository = new InMemoryReviewAttachmentsRepository()
    inMemoryReviewRepository = new InMemoryReviewsRepository(
      inMemoryReviewAttachmentsRepository
    )
    sut = new DeleteReviewUseCase(inMemoryReviewRepository)
  })

  it('should be able to delete a review', async () => {
    const review = makeReview()
    await inMemoryReviewRepository.create(review)

    const response = await sut.execute({
      reviewId: review.id.toString(),
      reviewerId: review.reviewerId.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryReviewRepository.reviews).toHaveLength(0)
    expect(inMemoryReviewAttachmentsRepository.attachments).toHaveLength(0)
  })

  it('should not be able to delete a review with wrong user id', async () => {
    const review = makeReview()
    await inMemoryReviewRepository.create(review)

    const response = await sut.execute({
      reviewId: review.id.toString(),
      reviewerId: 'invalid-user-id'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})