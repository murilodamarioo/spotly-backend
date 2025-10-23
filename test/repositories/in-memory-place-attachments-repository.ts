import { PlaceAttachment } from '@/domain/core/enterprise/entities/place-attachment'
import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository'

export class InMemoryPlaceAttachmentsRepository implements PlaceAttachmentsRepository {
  public attachments: PlaceAttachment[] = []

  async findManyByPlaceId(id: string): Promise<PlaceAttachment[]> {
    const placeAttachments = this.attachments.filter(
      (attachment) => attachment.placeId.toString() === id
    )

    return placeAttachments
  }

  async deleteManyById(id: string): Promise<void> {
    const placeAttachments = this.attachments.filter(
      (attachments) => attachments.placeId.toString() !== id
    )

    this.attachments = placeAttachments
  }

}