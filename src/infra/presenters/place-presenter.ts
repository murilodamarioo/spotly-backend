import { Place } from '@/domain/core/enterprise/entities/place'

export class PlacePresenter {

  static toHttp(place: Place) {
    return {
      id: place.id.toString(),
      name: place.name,
      category: place.category,
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state,
      attachments: place.attachments.getItems()
        .map(attachment => attachment.attachmentId.toString()),
      createdAt: place.createdAt
    }
  }

}