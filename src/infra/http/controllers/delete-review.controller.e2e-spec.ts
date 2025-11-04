import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { PlaceFactory } from 'test/factories/make-place'
import { UserFactory } from 'test/factories/make-user'
import { ReviewFactory } from 'test/factories/make-review'

import request from 'supertest'

describe('Delete review (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let reviewFactory: ReviewFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory, ReviewFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)
    reviewFactory = moduleRef.get(ReviewFactory)

    await app.init()
  })

  test('[DELETE] /reviews/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const review = await reviewFactory.makePrismaReview({
      placeId: place.id,
      reviewerId: user.id
    })

    const response = await request(app.getHttpServer())
      .delete(`/reviews/${review.id.toString()}`)
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(204)

    const reviewsOnDatabase = await prisma.review.findFirst()

    expect(reviewsOnDatabase).toBeNull()
  })
})