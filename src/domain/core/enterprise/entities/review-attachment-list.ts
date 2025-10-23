import { WatchedList } from '@/core/entities/watched-list'
import { ReviewAttachmentProps } from './review-attachment';

export class ReviewAttachmentList extends WatchedList<ReviewAttachmentProps> {

  compareItems(a: ReviewAttachmentProps, b: ReviewAttachmentProps): boolean {
    return a.reviewId.equals(b.reviewId)
  }

}