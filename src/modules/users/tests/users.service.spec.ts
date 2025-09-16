import { UserEmailAlreadyExistsError } from '@/commons/errors/application-errors/user-email-already-exists'

import { UsersService } from '../users.service'

import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRespository } from 'test/repositories/in-memory-user-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let usersService: UsersService
let inMemoryUserRepository: InMemoryUserRespository
let fakeHasher: FakeHasher

describe('Users Service Test Suit', () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRespository()
    fakeHasher = new FakeHasher()
    usersService = new UsersService(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to create a new User', async () => {
    const user = makeUser({
      name: 'John Doe'
    })

    const response = await usersService.create(user)

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUserRepository.users).toHaveLength(1)
    expect(inMemoryUserRepository.users[0].name).toEqual('John Doe')
  })

  it('should hash user password upon registration', async () => {
    const response = await usersService.create({
      name: 'John Doe',
      email: 'john@example',
      password: 'nEwP@ssw0rd',
      bio: 'bio'
    })

    const hashedPassword = await fakeHasher.hash('nEwP@ssw0rd')

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUserRepository.users[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a new user with registered email', async () => {
    const user = makeUser({
      email: 'john@gmail'
    })

    inMemoryUserRepository.users.push(user)

    const response = await usersService.create({
      name: 'John Doe',
      email: 'john@gmail',
      password: '123456',
      bio: 'bio'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserEmailAlreadyExistsError)
  })
})