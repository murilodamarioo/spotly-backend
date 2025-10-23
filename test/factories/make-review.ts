import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Review, ReviewProps } from '@/domain/core/enterprise/entities/review'

import { faker } from '@faker-js/faker'

export function makeReview(override: Partial<ReviewProps> = {}, id?: UniqueEntityId): Review {
  const review = Review.create({
    placeId: new UniqueEntityId(),
    reviewerId: new UniqueEntityId(),
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    ...override
  }, id)

  return review
}