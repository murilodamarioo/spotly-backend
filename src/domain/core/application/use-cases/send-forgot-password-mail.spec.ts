import { SendForgotPasswordMailUseCase } from './send-forgot-password-mail'

import { InMemoryPasswordResetTokenRepository } from 'test/repositories/in-memory-password-reset-token-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'

import { FakeMailService } from 'test/mail/fake-mail-service'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeUser } from 'test/factories/make-user'
import { E } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq'

let fakeEncrypter: FakeEncrypter
let inMemoryPasswordResetTokenRespository: InMemoryPasswordResetTokenRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCateforiesRepository: InMemoryFavoriteCategoriesRepository
let fakeMailService: FakeMailService
let sut: SendForgotPasswordMailUseCase

describe('Send forgot password mail', () => {

  beforeEach(() => {
    inMemoryFavoriteCateforiesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCateforiesRepository
    )

    inMemoryPasswordResetTokenRespository = new InMemoryPasswordResetTokenRepository()

    fakeMailService = new FakeMailService()

    fakeEncrypter = new FakeEncrypter()

    sut = new SendForgotPasswordMailUseCase(
      inMemoryUsersRepository,
      inMemoryPasswordResetTokenRespository,
      fakeEncrypter,
      fakeMailService
    )
  })

  it('should be able to send forgot password mail', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const response = await sut.execute({
      email: user.email
    })

    expect(response.isSuccess()).toBeTruthy()

    const tokenOnDatabase = inMemoryPasswordResetTokenRespository.resetTokens[0].token

    expect(tokenOnDatabase).toBeDefined()
  })
})