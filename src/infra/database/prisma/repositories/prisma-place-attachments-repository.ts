import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository';
import { Attachment } from '@/domain/core/enterprise/entities/attachment';
import { PlaceAttachment } from '@/domain/core/enterprise/entities/place-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPlaceAttachmentsRepository implements PlaceAttachmentsRepository {

  findManyByPlaceId(id: string): Promise<PlaceAttachment[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

}