import { makePlace } from 'test/factories/make-place'
import { FetchPlacesUseCase } from './fetch-places'

import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let sut: FetchPlacesUseCase

describe('Fetch Places', () => {
  beforeEach(() => {
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository,
      inMemoryPlaceReactionsRepository
    )
    
    sut = new FetchPlacesUseCase(inMemoryPlacesRepository)
  })

  it('should be able to fetch places', async () => {
    await inMemoryPlacesRepository.create(
      makePlace({ createdAt: new Date(2025, 8, 27) })
    )
    await inMemoryPlacesRepository.create(
      makePlace({ createdAt: new Date(2025, 8, 29) })
    )
    await inMemoryPlacesRepository.create(
      makePlace({ createdAt: new Date(2025, 8, 28) })
    )

    const response = await sut.execute({ page: 1 })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.places).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 8, 29) }),
      expect.objectContaining({ createdAt: new Date(2025, 8, 28) }),
      expect.objectContaining({ createdAt: new Date(2025, 8, 27) })
    ])
  })

  it('should be able to fetch paginated places', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPlacesRepository.create(
        makePlace()
      )
    }

    const response = await sut.execute({ page: 2 })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value?.places).toHaveLength(2)
  })
})