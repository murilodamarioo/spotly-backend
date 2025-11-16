import { WatchedList } from '@/core/entities/watched-list'
import { ReviewAttachment, ReviewAttachmentProps } from './review-attachment'

export class ReviewAttachmentList extends WatchedList<ReviewAttachment> {

  compareItems(a: ReviewAttachmentProps, b: ReviewAttachmentProps): boolean {
    return a.reviewId.equals(b.reviewId)
  }

}