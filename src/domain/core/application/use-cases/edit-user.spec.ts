
import { EditUserUseCase } from './edit-user'

import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to edit a user', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      email: 'john@gmail.com',
      bio: user.bio
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUsersRepository.users[0]).toMatchObject({
      name: 'John Doe',
      email: 'john@gmail.com',
      bio: user.bio
    })
  })
})