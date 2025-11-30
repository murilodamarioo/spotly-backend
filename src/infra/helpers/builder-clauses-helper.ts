import { PlaceFiltersParams } from '@/core/repositories/place-filters-params'
import { Prisma } from '@prisma/client';

export class BuilderClausesHelper {

  static buildWhereClause(userId: string, params: PlaceFiltersParams): Prisma.PlaceWhereInput {
    const { query, category, filterType } = params

    const where: Prisma.PlaceWhereInput = {}

    if (category) where.category = category

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    const userFiltersStrategies: Record<string, Prisma.PlaceWhereInput> = {
      'liked_by_user': { placeReactions: { some: { userId, like: true } } },
      'disliked_by_user': { placeReactions: { some: { userId, dislike: true } } }
    }

    if (filterType && userId && userFiltersStrategies[filterType]) {
      Object.assign(where, userFiltersStrategies[filterType])
    }

    return where
  }

  static buildOrderByClause(params: PlaceFiltersParams): Prisma.PlaceOrderByWithRelationInput {
    const { sortBy } = params

    const sortStrategies: Record<string, Prisma.PlaceOrderByWithRelationInput> = {
      'recent': { createdAt: 'desc' },
      'most_popular': { placeReactions: { _count: 'desc' } }
    }

    return sortStrategies[sortBy || 'recent'] || sortStrategies['recent']
  }
}