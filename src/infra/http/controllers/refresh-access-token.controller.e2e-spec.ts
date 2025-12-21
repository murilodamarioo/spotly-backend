import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import cookieParser from 'cookie-parser'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'
import { hash } from 'bcryptjs'

describe('Authentication (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BcryptHasher],
    }).compile()

    app = moduleRef.createNestApplication()
    app.use(cookieParser())

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /auth/refresh', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'refresh@test.com',
      password: await hash('123456', 8),
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'refresh@test.com',
        password: '123456',
      })

    const cookies = loginResponse.get('Set-Cookie')!
    expect(cookies).toBeDefined()

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String)
    })

    if (cookies) {
      expect(cookies[0]).toContain('refreshToken=')
    }
  })
})