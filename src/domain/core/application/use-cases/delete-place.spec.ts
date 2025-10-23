import { NotAllowedError } from '@/core/errors/errors-message/not-allowed'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeletePlaceUseCase } from './delete-place'

import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'

import { makePlace } from 'test/factories/make-place'
import { makePlaceAttachment } from 'test/factories/make-place-attachment'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let sut: DeletePlaceUseCase

describe('Delete Place', () => {
  beforeEach(() => {
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository
    )
    sut = new DeletePlaceUseCase(inMemoryPlacesRepository)
  })

  it('should be able to delete a place', async () => {
    const place = makePlace({
      userId: new UniqueEntityId('user-1')
    })

    await inMemoryPlacesRepository.create(place)

    inMemoryPlaceAttachmentsRepository.attachments.push(
      makePlaceAttachment({
        placeId: place.id,
        attachmentId: new UniqueEntityId('1')
      }),
      makePlaceAttachment({
        placeId: place.id,
        attachmentId: new UniqueEntityId('2')
      })
    )

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: 'user-1'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryPlacesRepository.places).toHaveLength(0)
    expect(inMemoryPlaceAttachmentsRepository.attachments).toHaveLength(0)
  })

  it('should not be able to delete a place with wrong user id', async () => {
    const place = makePlace({
      userId: new UniqueEntityId('user-1')
    })

    await inMemoryPlacesRepository.create(place)

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: 'user-2'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})