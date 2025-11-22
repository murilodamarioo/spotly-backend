import { ReviewDetails } from '@/domain/core/enterprise/entities/value-objects/review-details'

import { AttachmentPresenter } from './attachment-presenter'

export class ReviewDetailsPresenter {

  static toHttp(reviewDetails: ReviewDetails) {
    return {
      rating: reviewDetails.rating,
      comment: reviewDetails.comment,
      reviewer: {
        name: reviewDetails.reviewer.name,
        profilePicture: reviewDetails.reviewer.profilePicutre
      },
      attachments: reviewDetails.attachments.map(AttachmentPresenter.toHttp),
      createdAt: reviewDetails.createdAt
    }
  }

}