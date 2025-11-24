import { INestApplication } from '@nestjs/common'

import { Test } from '@nestjs/testing'

import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'

import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { AppModule } from '@/infra/app.module'

import { DatabaseModule } from '../../database.module'

import { UserFactory } from 'test/factories/make-user'
import { PlaceFactory } from 'test/factories/make-place'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { PlaceAttachmentFactory } from 'test/factories/make-place-attachment'

describe('Prisma Places Repository (E2E)', async () => {
  let app: INestApplication
  let userFactory: UserFactory
  let placeFactory: PlaceFactory
  let attachmentFactory: AttachmentFactory
  let placeAttachmentFactory: PlaceAttachmentFactory
  let cacheRepository: CacheRepository
  let placesRepository: PlacesRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [PlaceFactory, UserFactory, AttachmentFactory, PlaceAttachmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    cacheRepository = moduleRef.get(CacheRepository)
    placesRepository = moduleRef.get(PlacesRepository)

    userFactory = moduleRef.get(UserFactory)
    placeFactory = moduleRef.get(PlaceFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    placeAttachmentFactory = moduleRef.get(PlaceAttachmentFactory)

    await app.init()
  })

  it('should cache place details', async () => {
    const user = await userFactory.makePrismaUser()

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const attachment = await attachmentFactory.makePrismaAttchament()

    await placeAttachmentFactory.makePrismaPlaceAttachment({
      placeId: place.id,
      attachmentId: attachment.id
    })

    const placeDetails = await placesRepository.findByIdWithDetails(place.id.toString())

    const cached = await cacheRepository.get(`place:${place.id.toString()}:details`)

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: placeDetails?.placeId.toString()
    }))
  })

  it('should return cached place deatils on subsquent calls', async () => {
    const user = await userFactory.makePrismaUser()

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const attachment = await attachmentFactory.makePrismaAttchament()

    await placeAttachmentFactory.makePrismaPlaceAttachment({
      placeId: place.id,
      attachmentId: attachment.id
    })

    let cached = await cacheRepository.get(`place:${place.id.toString()}:details`)
    expect(cached).toBeNull()

    await placesRepository.findByIdWithDetails(place.id.toString())

    cached = await cacheRepository.get(`place:${place.id.toString()}:details`)
    expect(cached).not.toBeNull()

    if (!cached) {
      throw new Error()
    }

    const placeDetails = await placesRepository.findByIdWithDetails(place.id.toString())

    expect(JSON.parse(cached)).toEqual(expect.objectContaining({
      id: placeDetails?.placeId.toString()
    }))
  })

  it('should reset question details cache when saving the place', async () => {
    const user = await userFactory.makePrismaUser()

    const place = await placeFactory.makePrismaPlace({
      userId: user.id
    })

    const attachment = await attachmentFactory.makePrismaAttchament()

    await placeAttachmentFactory.makePrismaPlaceAttachment({
      placeId: place.id,
      attachmentId: attachment.id
    })

    await placesRepository.findByIdWithDetails(place.id.toString())

    let cached = await cacheRepository.get(`place:${place.id.toString()}:details`)
    expect(cached).not.toBeNull()

    place.category = 'new-category'

    await placesRepository.save(place)

    cached = await cacheRepository.get(`place:${place.id.toString()}:details`)
    expect(cached).toBeNull()
  })
})