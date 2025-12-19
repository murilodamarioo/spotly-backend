import { ExpiredTokenError } from '@/core/errors/errors-message/expired-token'

import { ResetPasswordUseCase } from './reset-password'

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryFavoriteCategoriesRepository } from 'test/repositories/in-memory-favorite-categories-repository'
import { InMemoryPasswordResetTokenRepository } from 'test/repositories/in-memory-password-reset-token-repository'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { makePasswordResetToken } from 'test/factories/make-password-reset-token'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryFavoriteCategoriesRepository: InMemoryFavoriteCategoriesRepository
let inMemoryPasswordResetTokenRepository: InMemoryPasswordResetTokenRepository
let fakeHasher: FakeHasher
let sut: ResetPasswordUseCase

describe('Reset password', () => {

  beforeEach(() => {
    fakeHasher = new FakeHasher()

    inMemoryPasswordResetTokenRepository = new InMemoryPasswordResetTokenRepository()

    inMemoryFavoriteCategoriesRepository = new InMemoryFavoriteCategoriesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryFavoriteCategoriesRepository
    )

    sut = new ResetPasswordUseCase(
      inMemoryUsersRepository,
      inMemoryPasswordResetTokenRepository,
      fakeHasher
    )
  })

  it('should be able to reset password', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('0ldP@ssw0rd')
    })
    await inMemoryUsersRepository.create(user)

    const resetToken = makePasswordResetToken({
      userId: user.id
    })

    await inMemoryPasswordResetTokenRepository.create(resetToken)

    const response = await sut.execute({
      token: resetToken.token,
      newPassword: 'NewP@ssw0rd'
    })

    expect(response.isSuccess()).toBeTruthy()

    const userOnDatabase = await inMemoryUsersRepository.findById(
      user.id.toString()
    )

    expect(userOnDatabase?.password).toEqual('NewP@ssw0rd-hashed')
  })

  it('should not be able to reset password with expired token', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('0ldP@ssw0rd')
    })
    await inMemoryUsersRepository.create(user)

    const resetToken = makePasswordResetToken({
      userId: user.id
    })

    await inMemoryPasswordResetTokenRepository.create(resetToken)

    await new Promise((resolve) => setTimeout(resolve, 1000 * 3))

    const response = await sut.execute({
      token: resetToken.token,
      newPassword: 'NewP@ssw0rd'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ExpiredTokenError)
  })
})