import { Attachment } from '@/domain/core/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public attachments: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.attachments.push(attachment)
  }

  async delete(id: string): Promise<void> {
    this.attachments = this.attachments.filter(
      (attachment) => attachment.id.toString() !== id
    )
  }
}