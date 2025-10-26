import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Create place (E2E)', () => {
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

    userFactory = moduleRef.get(UserFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /places/create', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/places/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'La Pizza',
        category: 'Restaurant',
        description: 'The best pizza in town',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        attachments: []
      })

    expect(response.status).toBe(201)

    const placeOnDatabase = await prisma.place.findFirst({
      where: { userId: user.id.toString() }
    })

    expect(placeOnDatabase).toBeTruthy()
  })
})