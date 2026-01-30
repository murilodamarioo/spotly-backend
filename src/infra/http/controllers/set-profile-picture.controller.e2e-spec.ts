import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Set profile picture (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    app.init()
  })

  test('[PATCH] /users/me/profile-picture', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/users/me/profile-picture')
      .auth(accessToken, { type: 'bearer' })
      .attach('file', './test/e2e/profile.png')

    expect(response.status).toBe(200)
    
    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id.toString() }
    })

    expect(userOnDatabase?.profilePictureId).toEqual(expect.any(String))
  })
})