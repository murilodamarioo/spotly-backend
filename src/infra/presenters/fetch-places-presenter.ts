import { Place } from '@/domain/core/enterprise/entities/place'

export class FetchPlacesPresenter {

  static toHttp(place: Place) {
    return {
      name: place.name,
      category: place.category,
      description: place.description && place.description.length > 117
        ? place.description.substring(0, 117).concat('...')
        : place.description,
      attachments: place.attachments.getItems()
    }
  }
}