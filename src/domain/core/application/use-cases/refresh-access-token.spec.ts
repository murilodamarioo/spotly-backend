import { RefreshAccessTokenUseCase } from './refresh-access-token'

import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

import { makeUser } from 'test/factories/make-user'

let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: RefreshAccessTokenUseCase

describe('Refresh access token', () => {

  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )

    fakeEncrypter = new FakeEncrypter()

    sut = new RefreshAccessTokenUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to refresh access token', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const refreshToken = await fakeEncrypter.encrypt({ sub: user.id.toString() })

    const response = await sut.execute({
      refreshToken
    })

    expect(response.isSuccess()).toBeTruthy
    expect(response.value).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    })
  })
})