export type ReviewSummary = {
  id: string
  rating: number
  comment?: string | null
  reviewerId: string
  createdAt: Date
  updatedAt?: Date | null
  reviewer: {
    name: string,
    profilePicture?: string | null,
  }
}

export class ReviewSummaryPresenter {

  static toHTTP(reviewSummary: ReviewSummary) {
    return {
      id: reviewSummary.id.toString(),
      rating: reviewSummary.rating,
      comment: reviewSummary.comment,
      reviewerId: reviewSummary.reviewerId.toString(),
      createdAt: reviewSummary.createdAt,
      updatedAt: reviewSummary.updatedAt,
      reviewer: {
        name: reviewSummary.reviewer.name,
        profilePicture: reviewSummary.reviewer.profilePicture
      }
    }
  }

}