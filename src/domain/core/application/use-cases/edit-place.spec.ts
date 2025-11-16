import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditPlaceUseCase } from './edit-place'

import { InMemoryPlaceAttachmentsRepository } from 'test/repositories/in-memory-place-attachments-repository'
import { InMemoryPlacesRepository } from 'test/repositories/in-memory-places-repository'
import { makePlace } from 'test/factories/make-place'
import { makePlaceAttachment } from 'test/factories/make-place-attachment'

let inMemoryPlacesRepository: InMemoryPlacesRepository
let inMemoryPlaceAttachmentsRepository: InMemoryPlaceAttachmentsRepository
let sut: EditPlaceUseCase

describe('Edit Place', () => {
  beforeEach(() => {
    inMemoryPlaceAttachmentsRepository = new InMemoryPlaceAttachmentsRepository()
    inMemoryPlacesRepository = new InMemoryPlacesRepository(
      inMemoryPlaceAttachmentsRepository
    )
    sut = new EditPlaceUseCase(
      inMemoryPlacesRepository,
      inMemoryPlaceAttachmentsRepository
    )
  })

  it('should be able to edit a place', async () => {
    const place = makePlace({
      name: 'Marvel Comics Burger',
      description: 'The best burger in town',
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
      userId: place.userId.toString(),
      name: 'DC Comics Burger',
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachmentsIds: ['1', '2']
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryPlacesRepository.places[0]).toMatchObject({
      name: 'DC Comics Burger',
      description: 'The best burger in town'
    })
    expect(
      inMemoryPlaceAttachmentsRepository.attachments[0].placeId
    ).toEqual(inMemoryPlacesRepository.places[0].id)
  })

  it('should not be able to edit a place with wrong user id', async () => {
    const place = makePlace({
      userId: new UniqueEntityId('user-1')
    })
    await inMemoryPlacesRepository.create(place)

    const response = await sut.execute({
      placeId: place.id.toString(),
      userId: 'invalid-user-id',
      name: 'DC Comics Burger',
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachmentsIds: []
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a non existing place', async () => {
    const place = makePlace({}, new UniqueEntityId('user-1'))

    inMemoryPlacesRepository.create(place)

    const response = await sut.execute({
      placeId: 'invslid-place-id',
      userId: place.userId.toString(),
      name: 'DC Comics Burger',
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachmentsIds: []
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})