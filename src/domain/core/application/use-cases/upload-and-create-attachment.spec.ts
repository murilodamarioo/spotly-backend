import { InvalidAttachementTypeError } from '@/core/errors/errors-message'

import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakerUploader } from 'test/storage/fake-uploader'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakerUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakerUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    )
  })

  it('it should be able to upload an attachment', async () => {
    const response = await sut.execute({
      fileName: 'restaurant.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toEqual({
      attachment: inMemoryAttachmentsRepository.attachments[0]
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0].fileName).toEqual('restaurant.png')
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const response = await sut.execute({
      fileName: 'restaurant.pdf',
      fileType: 'image/pdf',
      body: Buffer.from('')
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidAttachementTypeError)
  })
})