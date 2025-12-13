import { ReactionType } from '@/core/enums/reaction-type'

import { TogglePlaceReactionUseCase } from './toggle-place-reaction'


import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'
import { makePlaceReaction } from 'test/factories/make-place-reaction'

import { makePlace } from 'test/factories/make-place'
import { makeUser } from 'test/factories/make-user'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'

let sut: TogglePlaceReactionUseCase
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository


describe('Toggle place reaction', () => {
  beforeEach(() => {
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository,
      inMemoryPlaceReactionsRepository
    )
    sut = new TogglePlaceReactionUseCase(
      inMemoryPlaceReactionsRepository,
      inMemoryPlacesRepository
    )
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