import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'

import request from 'supertest'

describe('Upload and create attachment (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .auth(accessToken, { type: 'bearer' })
      .attach('file', './test/e2e/restaurant.png')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String)
    })

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: {
        id: response.body.attachmentId
      }
    })

    expect(attachmentOnDatabase).toBeTruthy()
  })

  test('[POST] /attachments - Bad Request', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .auth(accessToken, { type: 'bearer' })
      .attach('file', './test/e2e/dance-vader.gif')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      'Validation failed (current file type is image/gif, expected type is .(png|jpeg|jpg))'
    )
  })
})