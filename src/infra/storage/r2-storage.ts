import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { 
  BucketType, 
  Uploader, 
  UploadParams
} from '@/domain/core/application/storage/uploader'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {

  private readonly s3Client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY')
      }
    })
  }

  private getBucketName(bucketType: BucketType): string {
    const buckets: Record<BucketType, string> = {
      'default': this.envService.get('AWS_BUCKET_NAME'),
      'profile-picture': this.envService.get('AWS_BUCKET_PROFILE_PICTURE')
    }

    return buckets[bucketType]
  }

  async upload({ fileName, fileType, body, bucketType = 'default' }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    const putObjectCommand = new PutObjectCommand({
      Bucket: this.getBucketName(bucketType),
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body
    })

    await this.s3Client.send(putObjectCommand)

    return { url: uniqueFileName }
  }
}