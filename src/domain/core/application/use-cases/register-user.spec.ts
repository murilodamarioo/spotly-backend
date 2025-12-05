import { UserAlreadyExistsError } from '@/core/errors/errors-message/user-already-exists'
import { RegisterUserUseCase } from './register-user'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHahser: FakeHasher
let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHahser = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHahser)
  })

  it('should be able to register a new user', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'nEwP@ssw0rd',
      bio: 'Bio of John Doe',
      categoryIds: ['1', '2']
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUsersRepository.users).toHaveLength(1)
  })

  it('should hash User password upon registration', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'nEwP@ssw0rd',
      bio: 'Bio of John Doe',
      categoryIds: ['1', '2']
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUsersRepository.users[0].password).toBe('nEwP@ssw0rd-hashed')
  })

  it('should not be able to register with an email that is already in use', async () => {
    const user = makeUser({ email: 'john@gmail.com' })

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'nEwP@ssw0rd',
      bio: 'Bio of John Doe',
      categoryIds: ['1', '2']
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})