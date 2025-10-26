import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors/errors-message'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Place } from '../../enterprise/entities/place'
import { PlaceAttachment } from '../../enterprise/entities/place-attachment'
import { PlaceAttachmentList } from '../../enterprise/entities/place-attachment-list'

import { PlacesRepository } from '../repositories/places-repository'
import { PlaceAttachmentsRepository } from '../repositories/place-attachments-repository'

interface EditPlaceUseCaseRequest {
  placeId: string
  userId: string
  name: string
  category: string
  description?: string | null
  address: string
  city: string
  state: string
  attachmentsIds: string[]
}

type EditPlaceUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, { place: Place }>

@Injectable()
export class EditPlaceUseCase {
  constructor(
    private placesRepository: PlacesRepository,
    private placeAttachmentsRepository: PlaceAttachmentsRepository
  ) { }

  async execute({
    placeId,
    userId,
    name,
    category,
    description,
    address,
    city,
    state,
    attachmentsIds
  }: EditPlaceUseCaseRequest): Promise<EditPlaceUseCaseResponse> {
    const place = await this.placesRepository.findById(placeId)

    if (!place) {
      return failure(new ResourceNotFoundError())
    }

    if (place.userId.toString() !== userId) {
      return failure(new NotAllowedError())
    }

    const currentPlaceAttachments = await this.placeAttachmentsRepository.findManyByPlaceId(placeId)
    const placeAttachmentList = new PlaceAttachmentList(currentPlaceAttachments)

    const placeAttachments = attachmentsIds.map(attachmentId => {
      return PlaceAttachment.create({
        placeId: place.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    placeAttachmentList.update(placeAttachments)

    place.name = name
    place.category = category
    place.description = description
    place.address = address
    place.city = city
    place.state = state
    place.attachments = placeAttachmentList

    await this.placesRepository.save(place)

    return success({ place })
  }
}