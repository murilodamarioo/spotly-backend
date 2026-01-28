import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { PlaceFactory } from 'test/factories/make-place'
import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'
import { ReactionType } from '@/core/enums/reaction-type'

describe('Toggle place reaction', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let jwt: JwtService
  let prisma: PrismaService

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

  test('[PATCH] /places/:id/reactions', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const response = await request(app.getHttpServer())
      .patch(`/places/${place.id.toString()}/reactions`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        reactionType: ReactionType.LIKE
      })

    expect(response.status).toBe(204)

    const placeReactionOnDatabse = await prisma.placeReaction.findFirst({
      where: {
        placeId: place.id.toString(),
        userId: user.id.toString()
      }
    })

    expect(placeReactionOnDatabse?.like).toBe(true)
    expect(placeReactionOnDatabse?.dislike).toBeNull()
  })
})