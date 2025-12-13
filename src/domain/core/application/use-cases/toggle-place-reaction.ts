import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidReactionTypeError, NotAllowedError } from '@/core/errors/errors-message'
import { ReactionType } from '@/core/enums/reaction-type'
import { Either, failure, success } from '@/core/either'

import { PlaceReaction } from '../../enterprise/entities/place-reaction'

import { PlaceReactionsRepository } from '../repositories/place-reactions-repository'
import { PlacesRepository } from '../repositories/places-repository'

interface TogglePlaceReactionUseCaseRequest {
  placeId: string
  userId: string
  reactionType: ReactionType
}

type TogglePlaceReactionUseCaseResponse = Either<NotAllowedError | InvalidReactionTypeError, null>

@Injectable()
export class TogglePlaceReactionUseCase {

  constructor(
    private placeReactionsRepository: PlaceReactionsRepository,
    private placesRepository: PlacesRepository
  ) { }

  async execute({
    placeId,
    userId,
    reactionType
  }: TogglePlaceReactionUseCaseRequest): Promise<TogglePlaceReactionUseCaseResponse> {

    if (!userId) {
      return failure(new NotAllowedError())
    }

    let placeReaction = await this.placeReactionsRepository.findExistingReaction(placeId, userId)

    if (!placeReaction) {
      placeReaction = PlaceReaction.create({
        placeId: new UniqueEntityId(placeId),
        userId: new UniqueEntityId(userId),
        like: null,
        dislike: null
      })
      await this.placeReactionsRepository.create(placeReaction)
    }

    if (!Object.values(ReactionType).includes(reactionType)) {
      return failure(new InvalidReactionTypeError())
    }

    if (reactionType === ReactionType.LIKE) {
      placeReaction.toggleLike()
    } else {
      placeReaction.toggleDislike()
    }

    await this.placeReactionsRepository.save(placeReaction)

    const total = await this.placeReactionsRepository.countReactionsByPlaceId(placeId)

    if (total % 100 === 0) {
      const place = await this.placesRepository.findById(placeId)
      if (place) {
        place.notifyReactionsMilestone(total)
        await this.placesRepository.save(place)
      }
    }

    return success(null)
  }
}