import { ResourceNotFoundError } from '@/core/errors/errors-message/resource-not-found'

import { GetPlaceUseCase } from './get-place'

import { makePlace } from 'test/factories/make-place'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let sut: GetPlaceUseCase

describe('Get Place', () => {

  beforeEach(() => {
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository
    )
    sut = new GetPlaceUseCase(inMemoryPlacesRepository)
  })

  it('should be able to get a place by id', async () => {
    const place = makePlace({ name: 'Marvel Comics Burguer' })

    await inMemoryPlacesRepository.create(place)

    const response = await sut.execute({ placeId: place.id.toString() })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      place: expect.objectContaining({
        name: 'Marvel Comics Burguer'
      })
    })
  })

  it('should not be able to get a place with invalid id', async () => {
    const place = makePlace()

    await inMemoryPlacesRepository.create(place)

    const response = await sut.execute({ placeId: 'invalid-id' })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})