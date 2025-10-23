import { ReviewAttachment } from "@/domain/core/enterprise/entities/review-attachment";
import { ReviewAttachmentsRepository } from "@/domain/core/application/repositories/review-attachments-repository";

export class InMemoryReviewAttachmentsRepository implements ReviewAttachmentsRepository {
  public attachments: ReviewAttachment[] = []

  async delete(id: string): Promise<void> {
    const reviewAttachments = this.attachments.filter(
      (attachments) => attachments.reviewId.toString() !== id
    )

    this.attachments = reviewAttachments
  }
}