import {
  Attachment as PrismaAttachment,
  Review as PrismaReview,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ReviewDetails } from '@/domain/core/enterprise/entities/value-objects/review-details'

import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaReviewDetails = PrismaReview & {
  reviewer: {
    name: string
    profilePicture: string | null
  }
  attachments: PrismaAttachment[]
}

export class PrismaReviewDetailsMapper {
  static toDomain(raw: PrismaReviewDetails): ReviewDetails {
    return ReviewDetails.create({
      reviewId: new UniqueEntityId(raw.id),
      rating: raw.rating,
      comment: raw.comment,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      reviewer: {
        name: raw.reviewer.name,
        profilePicutre: raw.reviewer.profilePicture
      },
      createdAt: raw.createdAt
    })
  }
}