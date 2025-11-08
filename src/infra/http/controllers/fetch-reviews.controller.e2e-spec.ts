import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'


import { PlaceFactory } from 'test/factories/make-place'
import { ReviewFactory } from 'test/factories/make-review'
import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Fetch reviews (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let reviewFactory: ReviewFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory, ReviewFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)
    reviewFactory = moduleRef.get(ReviewFactory)

    await app.init()
  })

  test('[GET] /places/:placeId/reviews', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    await Promise.all([
      reviewFactory.makePrismaReview({ placeId: place.id, reviewerId: user.id }),
      reviewFactory.makePrismaReview({ placeId: place.id, reviewerId: user.id }),
      reviewFactory.makePrismaReview({ placeId: place.id, reviewerId: user.id }),
      reviewFactory.makePrismaReview({ placeId: place.id, reviewerId: user.id }),
      reviewFactory.makePrismaReview({ placeId: place.id, reviewerId: user.id }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/places/${place.id.toString()}/reviews?page=1`)
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body.reviews).toHaveLength(5)
    expect(response.body.reviews[0]).toMatchObject({
      id: expect.any(String),
      rating: expect.any(Number),
      comment: expect.any(String),
      reviewerId: user.id.toString(),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      reviewer: {
        name: user.name,
        profilePicture: null
      }
    })
  })
})