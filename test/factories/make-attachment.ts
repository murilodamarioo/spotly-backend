import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Attachment, AttachmentProps } from '@/domain/core/enterprise/entities/attachment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'

export function makeAttachment(override: Partial<AttachmentProps> = {}, id?: UniqueEntityId) {
  const attachment = Attachment.create({
    title: faker.lorem.sentences({ min: 1, max: 2 }),
    url: faker.internet.url(),
    ...override
  }, id)

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaAttchament(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment)
    })

    return attachment
  }
}