import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Edit user (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[PUT] /users/me/edit', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/users/me/edit')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'John Wick',
        email: user.email,
        bio: user.bio
      })

    expect(response.status).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id.toString() }
    })

    expect(userOnDatabase).toMatchObject({
      name: 'John Wick',
      email: user.email,
      bio: user.bio
    })
  })

  test('[PUT] /users/me/edit - Conflict', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await userFactory.makePrismaUser({
      email: 'gerald@gmail.com'
    })

    const response = await request(app.getHttpServer())
      .put('/users/me/edit')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: user.name,
        email: 'gerald@gmail.com',
        bio: user.bio
      })

    expect(response.status).toBe(409)
  })
})