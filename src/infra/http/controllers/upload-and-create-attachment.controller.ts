import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator, 
  ParseFilePipe, 
  Post, 
  UploadedFile, 
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { InvalidAttachementTypeError } from '@/core/errors/errors-message'

import { UploadAndCreateAttachmentUseCase } from '@/domain/core/application/use-cases/upload-and-create-attachment'

const parseFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 5 // 2mb
    }),
    new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)'
    })
  ]
})

@Controller('/attachments')
export class UploadAndCreateAttachmentController {

  constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase) { }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(parseFilePipe) file: Express.Multer.File) {

    const response = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidAttachementTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = response.value

    return { attachmentId: attachment.id.toString() }
  }

}