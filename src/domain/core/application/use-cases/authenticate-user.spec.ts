import { AuthenticateUserUseCase } from './authenticate-user'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '@/core/errors/errors-message/invalid-credentials'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter
    )
  })

  it('should be able to authenticate an user', async () => {
    const hashedPassword = await fakeHasher.hash('nEwP@ssw0rd')

    const user = makeUser({
      email: 'john@gmail.com',
      password: hashedPassword
    })

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      email: 'john@gmail.com',
      password: 'nEwP@ssw0rd'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      access_token: expect.any(String)
    })
  })

  it('should not be able to authenticate an user with wrong credentials', async () => {
    const hashedPassword = await fakeHasher.hash('nEwP@ssw0rd')

    const user = makeUser({
      email: 'john@gmail.com',
      password: hashedPassword
    })

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      email: 'john@gmail.com',
      password: '123456'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })
})