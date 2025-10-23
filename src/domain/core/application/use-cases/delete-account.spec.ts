import { DeleteAccountUseCase } from './delete-account'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteAccountUseCase

describe('Delete Account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
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