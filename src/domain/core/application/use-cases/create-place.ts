import { Either, success } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Place } from '../../enterprise/entities/place'
import { PlaceAttachment } from '../../enterprise/entities/place-attachment'
import { PlaceAttachmentList } from '../../enterprise/entities/place-attachment-list'

import { PlacesRepository } from '../repositories/places-repository'
import { Injectable } from '@nestjs/common'

interface CreatePlaceUseCaseRequest {
  userId: string
  name: string
  category: string
  description: string
  address: string
  city: string
  state: string
  attachmentsIds: string[]
}

type CreatePlaceUseCaseResponse = Either<null, { place: Place }>

@Injectable()
export class CreatePlaceUseCase {

  constructor(private placesRepository: PlacesRepository) { }

  async execute({
    userId,
    name,
    category,
    description,
    address,
    city,
    state,
    attachmentsIds
  }: CreatePlaceUseCaseRequest): Promise<CreatePlaceUseCaseResponse> {
    const place = Place.create({
      userId: new UniqueEntityId(userId),
      name,
      category,
      description,
      address,
      city,
      state
    })

    const placeAttachments = attachmentsIds.map(attachmentId => {
      return PlaceAttachment.create({
        placeId: place.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    place.attachments = new PlaceAttachmentList(placeAttachments)

    await this.placesRepository.create(place)

    return success({ place })
  }

}