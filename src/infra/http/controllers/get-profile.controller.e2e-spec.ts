import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Get profile (E2E)', () => {
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

  test('[GET] /users/my-profile', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/users/my-profile')
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(200)
  })
})