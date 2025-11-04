import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaReviewMapper } from '@/infra/database/prisma/mappers/prisma-review-mapper'

import { Review, ReviewProps } from '@/domain/core/enterprise/entities/review'

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

@Injectable()
export class ReviewFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaReview(data: Partial<ReviewProps> = {}): Promise<Review> {
    const review = makeReview(data)

    await this.prisma.review.create({
      data: PrismaReviewMapper.toPrisma(review)
    })

    return review
  }
}