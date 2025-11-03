import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '@/infra/app.module'

import { PlaceFactory } from 'test/factories/make-place'
import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Create Review', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)

    await app.init()
  })

  test('[POST] /places/:placeId/reviews/new', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .post(`/places/${place.id.toString()}/reviews/new`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        rating: 5,
        comment: 'The best food in the town',
        attachments: []
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      review: {
        rating: 5,
        comment: 'The best food in the town'
      }
    })
  })
})