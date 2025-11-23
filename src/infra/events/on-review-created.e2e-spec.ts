import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '../app.module'
import { DatabaseModule } from '../database/database.module'

import { PrismaService } from '../database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'

import request from 'supertest'
import { waitFor } from 'test/utils/wait.for'

describe('On review created (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)

    await app.init()
  })

  it('should send notification when a review is created', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .post(`/places/${place.id.toString()}/reviews/new`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        content: 'This a new review',
        rating: 5,
        attachments: []
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString()
        }
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})