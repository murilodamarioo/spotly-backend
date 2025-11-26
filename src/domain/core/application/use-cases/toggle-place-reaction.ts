import { Injectable } from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/errors-message'
import { ReactionType } from '@/core/enums/reaction-type'
import { Either, failure, success } from '@/core/either'

import { PlaceReactionsRepository } from '../repositories/place-reactions-repository'

import { PlaceReaction } from '../../enterprise/entities/place-reaction'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface TogglePlaceReactionUseCaseRequest {
  placeId: string
  userId: string
  reactionType: ReactionType
}

type TogglePlaceReactionUseCaseResponse = Either<NotAllowedError, null>

@Injectable()
export class TogglePlaceReactionUseCase {

  constructor(private placeReactionsRepository: PlaceReactionsRepository) { }

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

    if (reactionType === ReactionType.LIKE) {
      placeReaction.toggleLike()
    } else {
      placeReaction.toggleDislike()
    }

    await this.placeReactionsRepository.save(placeReaction)

    return success(null)
  }
}