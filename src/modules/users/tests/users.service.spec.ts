import { InMemoryUserRespository } from 'test/repositories/in-memory-user-repository'
import { UsersService } from '../users.service'
import { makeUser } from 'test/factories/make-user'

let usersService: UsersService
let inMemoryUserRepository: InMemoryUserRespository

describe('Users Service Test Suit', () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRespository()
    usersService = new UsersService(inMemoryUserRepository)
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
})