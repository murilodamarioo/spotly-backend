import { Injectable } from '@nestjs/common'

import { PaginationParam } from '@/core/repositories/pagination-param'

import { ReviewAttachmentsRepository } from '@/domain/core/application/repositories/review-attachments-repository'
import { ReviewDetails } from '@/domain/core/enterprise/entities/value-objects/review-details'
import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'
import { Review } from '@/domain/core/enterprise/entities/review'

import { ReviewSummary } from '@/infra/presenters/review-summary-presenter'

import { PrismaService } from '../prisma.service'

import { PrismaReviewMapper } from '../mappers/prisma-review-mapper'
import { PrismaReviewDetailsMapper } from '../mappers/prisma-review-details-mapper'

@Injectable()
export class PrismaReviewsRepository implements ReviewsRepository {
  constructor(
    private prisma: PrismaService,
    private reviewAttachmentsRepository: ReviewAttachmentsRepository
  ) { }


  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id }
    })

    return review ? PrismaReviewMapper.toDomain(review) : null
  }

  async findByIdWithDetails(id: string): Promise<ReviewDetails | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        attachments: true,
        reviewer: {
          select: {
            name: true,
            profilePicture: true
          }
        }
      }
    })

    if (!review) {
      return null
    }

    const reviewDetails = PrismaReviewDetailsMapper.toDomain(review)

    return reviewDetails
  }

  async findManyByPlaceId(id: string, params: PaginationParam): Promise<ReviewSummary[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        placeId: id,
      },
      include: {
        reviewer: {
          select: {
            name: true,
            profilePicture: true
          }
        }
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return reviews
  }

  async create(review: Review): Promise<void> {
    const data = PrismaReviewMapper.toPrisma(review)

    await this.prisma.review.create({ data })

    await this.reviewAttachmentsRepository.createMany(
      review.attachments.getItems()
    )
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id }
    })

    await this.reviewAttachmentsRepository.deleteManyById(id)
  }

}