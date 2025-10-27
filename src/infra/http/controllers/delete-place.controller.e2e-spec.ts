import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '@/infra/app.module'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'

import request from 'supertest'

describe('Delete place (E2E)', () => {
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

  test('[DELETE] /places/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .delete(`/places/${place.id.toString()}`)
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(204)
  })

  test('[DELETE] /places/:id - Forbidden', async () => {
    const user = await userFactory.makePrismaUser()

    const notAllowedUser = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: notAllowedUser.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .delete(`/places/${place.id.toString()}`)
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Not allowed to perform this action.')
  })
})