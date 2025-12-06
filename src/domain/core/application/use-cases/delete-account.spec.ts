import { DeleteAccountUseCase } from './delete-account'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let sut: DeleteAccountUseCase

describe('Delete Account', () => {
  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )
    sut = new DeleteAccountUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete an account', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      userId: user.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryUsersRepository.users).toHaveLength(0)
  })
})