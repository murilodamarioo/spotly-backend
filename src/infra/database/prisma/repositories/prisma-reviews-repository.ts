import { Injectable } from '@nestjs/common'

import { PaginationParam } from '@/core/repositories/pagination-param'

import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'
import { Review } from '@/domain/core/enterprise/entities/review'

import { ReviewWithReviewer, ReviewWithReviewerPresenter } from '@/infra/presenters/review-with-reviewer-presenter'

import { PrismaService } from '../prisma.service'

import { PrismaReviewMapper } from '../mappers/prisma-review-mapper'

@Injectable()
export class PrismaReviewsRepository implements ReviewsRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id }
    })

    return review ? PrismaReviewMapper.toDomain(review) : null
  }

  async findManyByPlaceId(id: string, params: PaginationParam): Promise<ReviewWithReviewer[]> {
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
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id }
    })
  }

}