import { Injectable } from '@nestjs/common'

import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository'
import { PlaceAttachment } from '@/domain/core/enterprise/entities/place-attachment'

import { PrismaService } from '../prisma.service'
import { PrismaPlaceAttachmentMapper } from '../mappers/prisma-place-attachment-mapper'

@Injectable()
export class PrismaPlaceAttachmentsRepository implements PlaceAttachmentsRepository {

  constructor(private prisma: PrismaService) { }

  async createMany(attachments: PlaceAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaPlaceAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async findManyByPlaceId(id: string): Promise<PlaceAttachment[]> {
    const placeAttachments = await this.prisma.attachment.findMany({
      where: { placeId: id }
    })

    return placeAttachments.map(placeAttachment => {
      return PrismaPlaceAttachmentMapper.toDomain(placeAttachment)
    })
  }

  async deleteManyById(id: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { placeId: id }
    })
  }

}