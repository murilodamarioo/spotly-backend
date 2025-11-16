import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '@/infra/app.module'

import { PlaceFactory } from 'test/factories/make-place'
import { UserFactory } from 'test/factories/make-user'
import { AttachmentFactory } from 'test/factories/make-attachment'

import request from 'supertest'

describe('Create Review', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory, AttachmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /places/:placeId/reviews/new', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const attachment1 = await attachmentFactory.makePrismaAttchament()
    const attachment2 = await attachmentFactory.makePrismaAttchament()

    const response = await request(app.getHttpServer())
      .post(`/places/${place.id.toString()}/reviews/new`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        rating: 5,
        comment: 'The best food in the town',
        attachments: [
          attachment1.id.toString(),
          attachment2.id.toString()
        ]
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      review: {
        rating: 5,
        comment: 'The best food in the town'
      }
    })

    const reviewsOnDatabase = await prisma.review.findMany({
      where: {
        placeId: place.id.toString()
      }
    })

    expect(reviewsOnDatabase).toHaveLength(1)

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { reviewId: reviewsOnDatabase[0]?.id }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})