import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Place, PlaceProps } from '@/domain/core/enterprise/entities/place'
import { PrismaPlaceMapper } from '@/infra/database/prisma/mappers/prisma-place-mapper'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makePlace(override: Partial<PlaceProps> = {}, id?: UniqueEntityId): Place {
  const place = Place.create({
    userId: new UniqueEntityId(),
    name: faker.company.name(),
    category: faker.commerce.department(),
    description: faker.lorem.sentence(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    city: faker.location.city(),
    state: faker.location.state(),
    ...override,
  }, id)

  return place
}

@Injectable()
export class PlaceFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaPlace(data: Partial<PlaceProps> = {}): Promise<Place> {
    const place = makePlace(data)

    await this.prisma.place.create({
      data: PrismaPlaceMapper.toPrisma(place)
    })

    return place
  }
}