import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Send forgot password mail (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /auth/sign-in/forgot-password', async () => {
    const user = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in/forgot-password')
      .send({
        email: user.email
      })

    expect(response.status).toBe(201)

    const tokenOnDatabase = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id.toString()
      }
    })

    expect(tokenOnDatabase?.token).toBeDefined()
  })
})