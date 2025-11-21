import { PaginationParam } from '@/core/repositories/pagination-param'

import { Place } from '@/domain/core/enterprise/entities/place'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { PlaceDetails } from '@/domain/core/enterprise/entities/value-objects/place-details'

import { InMemoryPlaceAttachmentsRepository } from './in-memory-place-attachments-repository'

export class InMemoryPlacesRepository implements PlacesRepository {
  public places: Place[] = []

  constructor(private placeAttachmentsRepository: InMemoryPlaceAttachmentsRepository) { }

  async create(place: Place): Promise<void> {
    this.places.push(place)

    await this.placeAttachmentsRepository.createMany(
      place.attachments.getItems()
    )
  }

  async findById(id: string): Promise<Place | null> {
    const place = this.places.find((place) => place.id.toString() === id)

    return place ? place : null
  }

  async findByIdWithDetails(id: string): Promise<PlaceDetails | null> {
    const place = this.places.find((place) => place.id.toString() === id)

    if (!place) {
      return null
    }

    const placeAttachments = this.placeAttachmentsRepository.attachments.filter(
      (placeAttachment) => {
        return placeAttachment.placeId.equals(place.id)
      }
    )

    const attachments = placeAttachments.map((placeAttachment) => {
      const attachment = this.placeAttachmentsRepository.attachments.find((attachment) => {
        return attachment.id.equals(placeAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${placeAttachment.attachmentId.toString()}" does not exists`
        )
      }

      return attachments
    })


    return PlaceDetails.create({
      placeId: place.id,
      userId: place.userId,
      name: place.name,
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachments,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt
    })
  }

  async findManyByRecent({ page }: PaginationParam): Promise<Place[]> {
    const places = this.places
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return places
  }

  async save(place: Place) {
    const placeIndex = this.places.findIndex((item) => item.id === place.id)

    this.places[placeIndex] = place
  }

  async delete(id: string) {
    const placeIndex = this.places.findIndex((place) => place.id.toString() === id)

    this.places.splice(placeIndex, 1)

    this.placeAttachmentsRepository.deleteManyById(id)
  }
}