import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { DomainEvents } from '@/core/events/domain-events'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { NotificationFactory } from 'test/factories/make-notification'
import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let notificationFactory: NotificationFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, NotificationFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  test('[PATCH] /notifications/:id/read', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}/read`)
      .auth(accessToken, { type: 'bearer' })

    expect(response.status).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString()
      }
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})