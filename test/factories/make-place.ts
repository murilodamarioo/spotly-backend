import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Place, PlaceProps } from '@/domain/core/enterprise/entities/place'

import { faker } from '@faker-js/faker'

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

// TODO: Implements PlaceFactory