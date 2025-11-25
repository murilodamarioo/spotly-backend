
import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PlaceReaction, PlaceReactionProps } from '@/domain/core/enterprise/entities/place-reaction'

export function makePlaceReaction(override: Partial<PlaceReactionProps> = {}, id?: UniqueEntityId): PlaceReaction {
  return PlaceReaction.create({
    placeId: new UniqueEntityId(),
    userId: new UniqueEntityId(),
    like: null,
    dislike: null,
    ...override,
  }, id)
}