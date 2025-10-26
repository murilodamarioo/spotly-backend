import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { Attachment } from '@/domain/core/enterprise/entities/attachment'

import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {

  constructor(private prisma: PrismaService) { }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({ data })
  }

}