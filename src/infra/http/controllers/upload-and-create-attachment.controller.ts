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
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
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

@ApiTags('attachmemts')
@ApiBearerAuth('jwt')
@Controller('/attachments')
export class UploadAndCreateAttachmentController {

  constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase) { }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
      required: ['file']
    }
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'uuid', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Validation failed (current file type is image/gif, expected type is .(png|jpeg|jpg))' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
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