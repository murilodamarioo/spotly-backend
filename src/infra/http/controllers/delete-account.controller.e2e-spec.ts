import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Delete account (E2E)', () => {
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

  test('[DELETE] /users/me', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete('/users/me')
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: user.id.toString() }
    })

    expect(userOnDatabase).toBeNull()
  })
})