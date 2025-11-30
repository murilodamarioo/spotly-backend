import { Injectable } from '@nestjs/common'

import { PlaceFiltersParams } from '@/core/repositories/place-filters-params'
import { PaginationParam } from '@/core/repositories/pagination-param'

import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { PlaceDetails } from '@/domain/core/enterprise/entities/value-objects/place-details'
import { Place } from '@/domain/core/enterprise/entities/place'

import { CacheRepository } from '@/infra/cache/cache-repository'
import { BuilderClausesHelper } from '@/infra/helpers/builder-clauses-helper'

import { PrismaService } from '../prisma.service'

import { PrismaPlaceMapper } from '../mappers/prisma-place-mapper'
import { PrismaPlaceDetailsMapper } from '../mappers/prisma-place-details-mapper'

@Injectable()
export class PrismaPlacesRepository implements PlacesRepository {

  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private placeAttachmentsRepository: PlaceAttachmentsRepository
  ) { }

  async create(place: Place): Promise<void> {
    const data = PrismaPlaceMapper.toPrisma(place)

    await this.prisma.place.create({ data })

    await this.placeAttachmentsRepository.createMany(
      place.attachments.getItems()
    )
  }

  async findById(id: string): Promise<Place | null> {
    const place = await this.prisma.place.findUnique({
      where: { id }
    })

    return place ? PrismaPlaceMapper.toDomain(place) : null
  }

  async findByIdWithDetails(id: string): Promise<PlaceDetails | null> {
    const cacheHit = await this.cache.get(id)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaPlaceDetailsMapper.toDomain(cacheData)
    }

    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        attachments: true
      }
    })

    if (!place) {
      return null
    }

    await this.cache.set(`place:${id}:details`, JSON.stringify(place))

    const placeDetails = PrismaPlaceDetailsMapper.toDomain(place)

    return placeDetails
  }

  async findManyByFilter(userId: string, params: PlaceFiltersParams): Promise<Place[]> {
    const { page } = params
    const perPage = 20

    const places = await this.prisma.place.findMany({
      where: BuilderClausesHelper.buildWhereClause(userId, params),
      orderBy: BuilderClausesHelper.buildOrderByClause(params),
      take: perPage,
      skip: (page - 1) * perPage
    })

    return places.map(place => {
      return PrismaPlaceMapper.toDomain(place)
    })
  }

  async findManyByRecent(params: PaginationParam): Promise<Place[]> {
    const places = await this.prisma.place.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20
    })

    return places.map(place => {
      return PrismaPlaceMapper.toDomain(place)
    })
  }

  async save(place: Place): Promise<void> {
    const data = PrismaPlaceMapper.toPrisma(place)

    await Promise.all([
      this.prisma.place.update({
        where: { id: data.id },
        data
      }),
      this.placeAttachmentsRepository.createMany(place.attachments.getNewItems()),
      this.placeAttachmentsRepository.deleteMany(place.attachments.getRemovedItems()),
      this.cache.delete(`place:${place.id}:details`)
    ])
  }

  async delete(id: string): Promise<void> {
    await this.prisma.place.delete({
      where: { id }
    })
  }

}