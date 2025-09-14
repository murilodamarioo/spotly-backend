import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { UserFactoryModule } from './user-factory.module'

describe('Users Service (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UserFactoryModule],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  it('[POST] /users - Create new user account', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        bio: 'Lorem ipsum dolor sit amet'
      })

    expect(response.statusCode).toBe(201)
  })

  it('[POST] /users - Error to create a new user account with registered email', async () => {
    await userFactory.makeOrmUser({
      email: 'john@example.com'
    })

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        bio: 'Lorem ipsum dolor sit amet'
      })

    expect(response.statusCode).toBe(409)
  })

  afterEach(async () => {
    await app.close()
  })
})