import { ChangePasswordUseCase } from './change-password'

import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

import { makeUser } from 'test/factories/make-user'
import { InvalidPasswordError } from '@/core/errors/errors-message/invalid-password'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategory: InMemoryFavoriteCategoriesRepository
let fakeHasher: FakeHasher
let sut: ChangePasswordUseCase

describe('Change password', () => {

  beforeEach(() => {
    fakeHasher = new FakeHasher()

    inMemoryFavoriteCategory = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategory
    )

    sut = new ChangePasswordUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeHasher
    )
  })

  it('should be able to change password', async () => {
    const hashedPassword = await fakeHasher.hash('0ldP@ssw0rd')

    const user = makeUser({
      email: 'john@gmail.com',
      password: hashedPassword
    })

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      userId: user.id.toString(),
      oldPassword: '0ldP@ssw0rd',
      newPassword: 'NewP@ssw0rd'
    })

    expect(response.isSuccess()).toBeTruthy()

    const userOnDatabase = await inMemoryUsersRepository.findById(user.id.toString())

    expect(userOnDatabase?.password).toEqual('NewP@ssw0rd-hashed')
  })

  it('should not be able ro change password with wrong old password', async () => {
    const hashedPassword = await fakeHasher.hash('0ldP@ssw0rd')

    const user = makeUser({
      email: 'john@gmail.com',
      password: hashedPassword
    })

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      userId: user.id.toString(),
      oldPassword: 'wrong-password',
      newPassword: 'NewP@ssw0rd'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidPasswordError)

    const userOnDatabase = await inMemoryUsersRepository.findById(user.id.toString())

    expect(userOnDatabase?.password).toEqual('0ldP@ssw0rd-hashed')
  })
})