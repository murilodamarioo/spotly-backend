import { Injectable } from '@nestjs/common'

import { InvalidAttachementTypeError, ResourceNotFoundError } from '@/core/errors/errors-message'
import { Either, failure, success } from '@/core/either'

import { UsersRepository } from '../repositories/users-repository'
import { Uploader } from '../storage/uploader'

import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'

interface SetUserProfilePictureRequest {
  userId: string
  fileName: string
  fileType: string
  body: Buffer
}

type SetUserProfilePictureUseCaseResponse = Either<
  InvalidAttachementTypeError | ResourceNotFoundError, 
  null
>

@Injectable()
export class SetUserProfilePictureUseCase {

  constructor(
    private usersRepository: UsersRepository,
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) {}

  async execute({
    userId,
    fileName,
    fileType,
    body
  }: SetUserProfilePictureRequest): Promise<SetUserProfilePictureUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new ResourceNotFoundError())
    }

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

    user.profilePicture = attachment.url
    await this.usersRepository.save(user)

    return success(null)
  }
}
