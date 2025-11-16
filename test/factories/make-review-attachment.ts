import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ReviewAttachment, ReviewAttachmentProps } from '@/domain/core/enterprise/entities/review-attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeReviewAttachment(
  override: Partial<ReviewAttachmentProps> = {},
  id?: UniqueEntityId
): ReviewAttachment {
  const reviewAttachment = ReviewAttachment.create({
    attachmentId: new UniqueEntityId(),
    reviewId: new UniqueEntityId(),
    ...override
  }, id)

  return reviewAttachment
}

export class ReviewAttachmentFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaReviewAttachment(
    data: Partial<ReviewAttachmentProps> = {}
  ): Promise<ReviewAttachment> {
    const reviewAttachment = makeReviewAttachment(data)

    await this.prisma.attachment.update({
      where: { id: reviewAttachment.attachmentId.toString() },
      data: {
        reviewId: reviewAttachment.reviewId.toString()
      }
    })

    return reviewAttachment
  }
}