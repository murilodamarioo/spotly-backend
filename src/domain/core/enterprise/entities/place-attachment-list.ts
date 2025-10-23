import { WatchedList } from '@/core/entities/watched-list'

import { PlaceAttachment } from './place-attachment'

export class PlaceAttachmentList extends WatchedList<PlaceAttachment> {

  compareItems(a: PlaceAttachment, b: PlaceAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }

}