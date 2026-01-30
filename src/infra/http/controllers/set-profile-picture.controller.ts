import { 
  BadRequestException,
  Controller, 
  FileTypeValidator, 
  HttpCode, 
  MaxFileSizeValidator, 
  NotFoundException, 
  ParseFilePipe, 
  Patch, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { InvalidAttachementTypeError, ResourceNotFoundError } from '@/core/errors/errors-message'

import { SetUserProfilePictureUseCase } from '@/domain/core/application/use-cases/set-profile-picture'

import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

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

@Controller('/users/me/profile-picture')
export class SetProfilePictureController {

  constructor(
    private setProfilePicture: SetUserProfilePictureUseCase
  ) { }

  @Patch()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(parseFilePipe) file: Express.Multer.File,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const response = await this.setProfilePicture.execute({
      userId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidAttachementTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}