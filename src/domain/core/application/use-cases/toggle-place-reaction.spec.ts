import { ReactionType } from '@/core/enums/reaction-type'

import { TogglePlaceReactionUseCase } from './toggle-place-reaction'


import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'

import { makePlace } from 'test/factories/make-place'
import { makeUser } from 'test/factories/make-user'
import { makePlaceReaction } from 'test/factories/make-place-reaction'

let sut: TogglePlaceReactionUseCase
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository

describe('Toggle place reaction', () => {
  beforeEach(() => {
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    sut = new TogglePlaceReactionUseCase(inMemoryPlaceReactionsRepository)
  })

  it('should be possible to mark a place with a "like"', async () => {
    const user = makeUser()

    const place = makePlace({
      userId: user.id
    })

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: user.id.toString(),
      reactionType: ReactionType.LIKE
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryPlaceReactionsRepository.placeReactions[0].like).toEqual(true)
  })

  it('should be possible to mark a place with a "dislike"', async () => {
    const user = makeUser()

    const place = makePlace({
      userId: user.id
    })

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: user.id.toString(),
      reactionType: ReactionType.DISLIKE
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryPlaceReactionsRepository.placeReactions[0].dislike).toEqual(true)
  })

  it('should be possible to toggle a reaction from "dislike"" to "like"', async () => {
    const user = makeUser()

    const place = makePlace({
      userId: user.id
    })

    const placeReaction = makePlaceReaction({
      placeId: place.id,
      userId: user.id,
      dislike: true
    })
    await inMemoryPlaceReactionsRepository.create(placeReaction)

    expect(inMemoryPlaceReactionsRepository.placeReactions[0]).toMatchObject({
      like: null,
      dislike: true
    })

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: user.id.toString(),
      reactionType: ReactionType.LIKE
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryPlaceReactionsRepository.placeReactions[0]).toMatchObject({
      like: true,
      dislike: null
    })
  })
})