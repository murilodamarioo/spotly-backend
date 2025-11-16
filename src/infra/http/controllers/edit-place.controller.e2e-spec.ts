import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { PlaceAttachmentFactory } from 'test/factories/make-place-attachment'

import request from 'supertest'

describe('Edit place (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let attachmentFactory: AttachmentFactory
  let placeAttachmentFactory: PlaceAttachmentFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaceFactory, PlaceAttachmentFactory, AttachmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    placeAttachmentFactory = moduleRef.get(PlaceAttachmentFactory)

    await app.init()
  })

  test('[PUT] /places/:id/edit', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttchament()
    const attachment2 = await attachmentFactory.makePrismaAttchament()

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    await placeAttachmentFactory.makePrismaPlaceAttachment({
      attachmentId: attachment1.id,
      placeId: place.id
    })

    await placeAttachmentFactory.makePrismaPlaceAttachment({
      attachmentId: attachment2.id,
      placeId: place.id
    })

    const attachment3 = await attachmentFactory.makePrismaAttchament()

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
        attachmentsIds: [
          attachment1.id.toString(),
          attachment3.id.toString()
        ]
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

    const placeAttachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        placeId: placeOnDatabase?.id
      }
    })

    expect(placeAttachmentsOnDatabase).toHaveLength(2)
    expect(placeAttachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ])
    )
  })
})