import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'
import { PasswordResetTokenFactory } from 'test/factories/make-password-reset-token'

import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let passwordResetTokenFactory: PasswordResetTokenFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PasswordResetTokenFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    passwordResetTokenFactory = moduleRef.get(PasswordResetTokenFactory)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /reset-password', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8)
    })

    const oldPassword = user.password

    const resetToken = await passwordResetTokenFactory.makePrismaReview({
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60)
    })

    const response = await request(app.getHttpServer())
      .patch(`/reset-password?token=${resetToken.token}`)
      .send({
        newPassword: '1234567'
      })

    expect(response.status).toBe(204)

    const userOnDatabase = await prisma.user.findFirst({
      where: { id: user.id.toString() }
    })

    expect(userOnDatabase?.password).not.toBe(oldPassword)
  })
})