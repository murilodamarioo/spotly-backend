import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ReviewAttachment } from '@/domain/core/enterprise/entities/review-attachment'

export class PrismaReviewAttachmentMapper {

  static toDomain(raw: PrismaAttachment): ReviewAttachment {
    if (!raw.reviewId) {
      throw new Error('Invalid attachment type')
    }

    return ReviewAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      reviewId: new UniqueEntityId(raw.reviewId)
    }, new UniqueEntityId(raw.id))
  }

  static toPrismaUpdateMany(attachments: ReviewAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: { id: { in: attachmentIds } },
      data: { reviewId: attachments[0].reviewId.toString() }
    }
  }
}