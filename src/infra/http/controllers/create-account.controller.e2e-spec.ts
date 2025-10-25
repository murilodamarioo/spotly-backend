import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'

describe('Create account (E2E)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] /sign-up', async () => {
    const response = await request(app.getHttpServer())
      .post('/sign-up')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'nEwP@ssw0rd',
        bio: 'I am John Doe'
      })

    expect(response.status).toBe(201)
  })
})