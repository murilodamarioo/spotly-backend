import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Change password (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[PATCH] /users/me/change-password', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8)
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/users/me/change-password')
      .auth(accessToken, { type: 'bearer' })
      .send({
        oldPassword: '123456',
        newPassword: '1234567'
      })

    expect(response.status).toBe(204)
  })
})