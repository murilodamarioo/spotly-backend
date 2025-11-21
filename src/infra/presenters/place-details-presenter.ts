import { PlaceDetails } from '@/domain/core/enterprise/entities/value-objects/place-details'

import { AttachmentPresenter } from './attachment-presenter'

export class PlaceDetailsPresenter {

  static toHttp(place: PlaceDetails) {
    return {
      id: place.placeId.toString(),
      name: place.name,
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachments: place.attachments.map(AttachmentPresenter.toHttp),
      createdAt: place.createdAt,
      updatedAt: place.updatedAt
    }
  }

}