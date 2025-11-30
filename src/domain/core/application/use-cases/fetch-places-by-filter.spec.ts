import { FetchPlacesByFilterUseCase } from './fetch-places-by-filter'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'

import { makeUser } from 'test/factories/make-user'
import { makePlace } from 'test/factories/make-place'
import { makePlaceReaction } from 'test/factories/make-place-reaction'

let sut: FetchPlacesByFilterUseCase
let inMemoryUseraRepository: InMemoryUsersRepository
let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let inMemoryPlaceAttachmentsReposiotry: InMemoryPlaceAttachmentsRepository

describe('Fetch places by filter', () => {
  beforeEach(() => {
    inMemoryUseraRepository = new InMemoryUsersRepository()
    inMemoryPlaceAttachmentsReposiotry = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsReposiotry,
      inMemoryPlaceReactionsRepository
    )

    sut = new FetchPlacesByFilterUseCase(inMemoryPlacesRepository)
  })

  it('should be possible to fetch places by category filter', async () => {
    const user = makeUser()
    await inMemoryUseraRepository.create(user)

    Promise.all([
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, category: 'restaurant' }),
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, category: 'museum' })
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, category: 'restaurant' })
      )
    ])

    const response = await sut.execute({
      userId: user.id.toString(),
      placeFiltersParams: {
        category: 'museum',
        page: 1
      }
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.places).toHaveLength(1)
  })

  it('should be possible to fetch places by query filter', async () => {
    const user = makeUser()
    await inMemoryUseraRepository.create(user)

    Promise.all([
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, name: 'DC Comics Burger' })
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, name: 'Marvel Comics Cafe' })
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id, name: 'Pizza Hut' })
      )
    ])

    const response = await sut.execute({
      userId: user.id.toString(),
      placeFiltersParams: {
        query: 'comics',
        page: 1
      }
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.places).toHaveLength(2)
  })

  it('sould be possible to fetch places liked by user', async () => {
    const user = makeUser()
    await inMemoryUseraRepository.create(user)

    Promise.all([
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id })
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id })
      ),
      inMemoryPlacesRepository.create(
        makePlace({ userId: user.id })
      )
    ])

    await inMemoryPlaceReactionsRepository.create(
      makePlaceReaction({
        placeId: inMemoryPlacesRepository.places[0].id,
        userId: user.id,
        like: true
      })
    )

    const response = await sut.execute({
      userId: user.id.toString(),
      placeFiltersParams: {
        filterType: 'liked_by_user',
        page: 1
      }
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.places).toHaveLength(1)
  })
})