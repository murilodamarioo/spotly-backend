import { PlaceReactionsRepository } from '@/domain/core/application/repositories/place-reactions-repository'
import { PlaceReaction } from '@/domain/core/enterprise/entities/place-reaction'

export class InMemoryPlaceReactionsRepository implements PlaceReactionsRepository {
  public placeReactions: PlaceReaction[] = []

  async create(placeReaction: PlaceReaction): Promise<void> {
    this.placeReactions.push(placeReaction)
  }

  async findExistingReaction(placeId: string, userId: string): Promise<PlaceReaction | null> {
    const placeReaction = this.placeReactions.find(
      (reaction) => {
        return reaction.placeId.toString() === placeId && reaction.userId.toString() === userId
      }
    )

    return placeReaction ? placeReaction : null
  }

  async save(placeReaction: PlaceReaction): Promise<void> {
    const reactionIndex = this.placeReactions.findIndex(
      (reaction) => reaction.id.toString() === placeReaction.id.toString()
    )

    this.placeReactions[reactionIndex] = placeReaction
  }
}