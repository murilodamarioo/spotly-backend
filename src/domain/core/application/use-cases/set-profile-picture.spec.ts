import { SetUserProfilePictureUseCase } from './set-profile-picture'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { FakerUploader } from 'test/storage/fake-uploader'
import { makeUser } from 'test/factories/make-user'

let fakeUploader: FakerUploader
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryFavoriteCategory: InMemoryFavoriteCategoriesRepository
let sut: SetUserProfilePictureUseCase

describe('Set Profile Picture Use Case', () => {

  beforeEach(() => {
    inMemoryFavoriteCategory = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategory
    )
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    fakeUploader = new FakerUploader()

    sut = new SetUserProfilePictureUseCase(
      inMemoryUsersRepository,
      inMemoryAttachmentsRepository,
      fakeUploader
    )
  })

  it('should be able to set profile picture', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    expect(user.profilePicture).toBeNull()

    const response = await sut.execute({
      userId: user.id.toString(),
      fileName: 'profile-picture.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(response.isSuccess()).toBe(true)
    expect(user.profilePicture).toBeDefined()
  })
})