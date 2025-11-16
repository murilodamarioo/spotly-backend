import { ReviewAttachment } from "@/domain/core/enterprise/entities/review-attachment";
import { ReviewAttachmentsRepository } from "@/domain/core/application/repositories/review-attachments-repository";

export class InMemoryReviewAttachmentsRepository implements ReviewAttachmentsRepository {
  public attachments: ReviewAttachment[] = []

  async createMany(attachments: ReviewAttachment[]): Promise<void> {
    this.attachments.push(...attachments)
  }

  async findManyByReviewId(id: string): Promise<ReviewAttachment[]> {
    const reviewAttachments = this.attachments.filter(
      (attachment) => attachment.reviewId.toString() === id
    )

    return reviewAttachments
  }

  async deleteMany(attachments: ReviewAttachment[]): Promise<void> {
    const reviewAttachments = this.attachments.filter(
      (attachment) => !attachments.includes(attachment)
    )

    this.attachments = reviewAttachments
  }

  async deleteManyById(id: string): Promise<void> {
    const reviewAttachments = this.attachments.filter(
      (attachments) => attachments.reviewId.toString() !== id
    )

    this.attachments = reviewAttachments
  }
}