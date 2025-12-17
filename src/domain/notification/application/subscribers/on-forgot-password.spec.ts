import { SendForgotPasswordMailUseCase } from '@/domain/core/application/use-cases/send-forgot-password-mail'

import { OnForgotPassword } from './on-forgot-password'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryPasswordResetTokenRepository } from 'test/repositories/in-memory-password-reset-token-repository'

import { FakeMailService } from 'test/mail/fake-mail-service'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeUser } from 'test/factories/make-user'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait.for'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryPasswordResetTokenRepository: InMemoryPasswordResetTokenRepository
let sut: SendForgotPasswordMailUseCase
let onForgotPassword: OnForgotPassword

let fakeEncrypter: FakeEncrypter
let fakeMailService: FakeMailService

let sendResetPasswordMailSpy: MockInstance

describe('On forgot password', () => {

  beforeEach(() => {
    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )

    inMemoryPasswordResetTokenRepository = new InMemoryPasswordResetTokenRepository()

    fakeEncrypter = new FakeEncrypter()

    sut = new SendForgotPasswordMailUseCase(
      inMemoryUsersRepository,
      inMemoryPasswordResetTokenRepository,
      fakeEncrypter
    )

    fakeMailService = new FakeMailService()

    sendResetPasswordMailSpy = vi.spyOn(fakeMailService, 'sendMail')

    new OnForgotPassword(
      inMemoryUsersRepository,
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

    await waitFor(() => {
      expect(sendResetPasswordMailSpy).toHaveBeenCalledOnce()
    })
  })

})