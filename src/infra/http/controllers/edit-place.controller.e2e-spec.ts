import { INestApplication } from '@nestjs/common'

import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'

import request from 'supertest'

describe('Edit place (E2E)', () => {
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

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)

    await app.init()
  })

  test('[PUT] /places/:id/edit', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .put(`/places/${place.id.toString()}/edit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Bart`s Restaurant',
        category: 'Restaurant',
        description: place.description,
        address: place.address,
        city: place.city,
        state: place.state,
        attachmentsIds: []
      })

    expect(response.status).toBe(200)

    const placeOnDatabase = await prisma.place.findUnique({
      where: { id: place.id.toString() }
    })

    expect(placeOnDatabase).toMatchObject({
      name: 'Bart`s Restaurant',
      category: 'Restaurant',
      description: place.description,
      address: place.address,
      city: place.city,
      state: place.state
    })
  })
})