import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CreatePlaceUseCase } from './create-place'

import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryPlaceReactionsRepository } from 'test/repositories/in-memory-place-reactions-reposiotry'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let inMemoryPlaceReactionsRepository: InMemoryPlaceReactionsRepository
let sut: CreatePlaceUseCase

describe('Create Place', () => {
  beforeEach(() => {
    
inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlaceReactionsRepository = new InMemoryPlaceReactionsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository,
      inMemoryPlaceReactionsRepository
    )
    sut = new CreatePlaceUseCase(inMemoryPlacesRepository)
  })

  it('should be able to create a new place', async () => {
    const response = await sut.execute({
      userId: 'user-1',
      name: 'Marvel Comics Burguer',
      category: 'Burgers',
      description: 'The best burgers in the universe',
      attachmentsIds: ['1', '2'],
      address: 'Av. Paulista, 1000 - Bela Vista',
      city: 'São Paulo ',
      state: 'SP',
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toEqual({
      place: inMemoryPlacesRepository.places[0]
    })
    expect(inMemoryPlaceAttachmentsRepository.attachments[0].placeId).toEqual(
      inMemoryPlacesRepository.places[0].id
    )
  })
})