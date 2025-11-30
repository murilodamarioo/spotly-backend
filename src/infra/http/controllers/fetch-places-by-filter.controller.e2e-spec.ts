import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '@/infra/app.module'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'

import request from 'supertest'

describe('Fetch places by filter (E2E)', () => {
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

  test('[GET] /places', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      placeFactory.makePrismaPlace({
        userId: user.id,
        category: 'restaurant'
      }),
      placeFactory.makePrismaPlace({
        userId: user.id,
        category: 'Club'
      }),
      placeFactory.makePrismaPlace({
        userId: user.id,
        category: 'Club'
      })
    ])

    const response = await request(app.getHttpServer())
      .get('/places?page=1&category=Club')
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body.places).toHaveLength(2)
  })
})