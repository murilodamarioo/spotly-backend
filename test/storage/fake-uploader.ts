import { Uploader, UploadParams } from '@/domain/core/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakerUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams) {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url
    })

    return { url }
  }

  async uploadProfilePicture({ fileName }: UploadParams) {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url
    })

    return { url }
  }
}