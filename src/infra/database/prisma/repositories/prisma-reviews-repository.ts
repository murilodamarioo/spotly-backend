import { Injectable } from '@nestjs/common'

import { PaginationParam } from '@/core/repositories/pagination-param'

import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'
import { Review } from '@/domain/core/enterprise/entities/review'

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

  async findManyByPlaceId(id: string, params: PaginationParam): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { placeId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20
    })

    return reviews.map(review => {
      return PrismaReviewMapper.toDomain(review)
    })
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