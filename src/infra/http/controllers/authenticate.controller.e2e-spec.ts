import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'
import { hash } from 'bcryptjs'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /auth/sign-in', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8)
    })

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String)
    })
  })
})