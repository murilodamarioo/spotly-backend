import { Injectable } from '@nestjs/common'

import { ReviewAttachmentsRepository } from '@/domain/core/application/repositories/review-attachments-repository'
import { ReviewAttachment } from '@/domain/core/enterprise/entities/review-attachment'

import { PrismaService } from '../prisma.service'

import { PrismaReviewAttachmentMapper } from '../mappers/prisma-review-attachment-mapper'

@Injectable()
export class PrismaReviewAttachmentsRepository implements ReviewAttachmentsRepository {

  constructor(private prisma: PrismaService) { }

  async createMany(attachments: ReviewAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaReviewAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async findManyByReviewId(id: string): Promise<ReviewAttachment[]> {
    const reviewAttachments = await this.prisma.attachment.findMany({
      where: { reviewId: id }
    })

    return reviewAttachments.map(reviewAttachment => {
      return PrismaReviewAttachmentMapper.toDomain(reviewAttachment)
    })
  }

  async deleteMany(attachments: ReviewAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: { in: attachmentIds }
      }
    })
  }

  async deleteManyById(id: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { reviewId: id }
    })
  }
}