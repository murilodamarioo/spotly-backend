import { Review } from '@/domain/core/enterprise/entities/review'

export class ReviewPresenter {

  static toHTTP(review: Review) {
    return {
      id: review.id.toString(),
      rating: review.rating,
      comment: review.comment,
      reviewerId: review.reviewerId.toString(),
      placeId: review.placeId.toString(),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }
  }

}