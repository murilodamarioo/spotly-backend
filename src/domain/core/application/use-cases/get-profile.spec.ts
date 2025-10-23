import { GetProfileUseCase } from './get-profile'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get a profile', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      userId: user.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      profile: expect.objectContaining({
        name: user.name,
        email: user.email,
        bio: user.bio
      })
    })
  })
})