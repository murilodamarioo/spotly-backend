import { Either, failure, success } from '@/core/either'
import { InvalidAttachementTypeError } from '@/core/errors/errors-message'

import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachments-repository'

interface UploadeAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<InvalidAttachementTypeError, { attachment: Attachment }>

export class UploadAndCreateAttachmentUseCase {

  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) { }

  async execute({
    fileName,
    fileType,
    body
  }: UploadeAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const regexFileType = /^image\/(png|jpeg)$/

    if (!regexFileType.test(fileType)) {
      return failure(new InvalidAttachementTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body
    })

    const attachment = Attachment.create({
      title: fileName,
      url
    })

    await this.attachmentsRepository.create(attachment)

    return success({ attachment })
  }
}