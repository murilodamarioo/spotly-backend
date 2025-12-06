import { GetProfileUseCase } from './get-profile'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let sut: GetProfileUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )
    
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