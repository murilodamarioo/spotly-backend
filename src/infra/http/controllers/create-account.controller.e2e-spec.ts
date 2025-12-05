import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { Category } from '@/domain/core/enterprise/entities/category'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { CategoryFactory } from 'test/factories/make-category'

import request from 'supertest'

describe('Create account (E2E)', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[POST] /sign-up', async () => {
    let categories: Category[] = []

    for (let i = 0; i < 3; i++) {
      categories.push(await categoryFactory.makePrismaCategory())
    }

    const response = await request(app.getHttpServer())
      .post('/sign-up')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'nEwP@ssw0rd',
        bio: 'I am John Doe',
        categories: [
          categories[0].id.toString(),
          categories[1].id.toString(),
          categories[2].id.toString()
        ]
      })

    expect(response.status).toBe(201)
  })
})