export type ReviewWithReviewer = {
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

export class ReviewWithReviewerPresenter {

  static toHTTP(reviewWithReviewer: ReviewWithReviewer) {
    return {
      id: reviewWithReviewer.id.toString(),
      rating: reviewWithReviewer.rating,
      comment: reviewWithReviewer.comment,
      reviewerId: reviewWithReviewer.reviewerId.toString(),
      createdAt: reviewWithReviewer.createdAt,
      updatedAt: reviewWithReviewer.updatedAt,
      reviewer: {
        name: reviewWithReviewer.reviewer.name,
        profilePicture: reviewWithReviewer.reviewer.profilePicture
      }
    }
  }

}