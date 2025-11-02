import { Prisma, Review as PrismaReview } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Review } from '@/domain/core/enterprise/entities/review'

export class PrismaReviewMapper {

  static toDomain(raw: PrismaReview): Review {
    return Review.create({
      rating: raw.rating,
      comment: raw.comment,
      placeId: new UniqueEntityId(raw.placeId),
      reviewerId: new UniqueEntityId(raw.reviewerId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(review: Review): Prisma.ReviewUncheckedCreateInput {
    return {
      id: review.id.toString(),
      rating: review.rating,
      comment: review.comment,
      placeId: review.placeId.toString(),
      reviewerId: review.reviewerId.toString(),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }
  }

}