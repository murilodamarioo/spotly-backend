import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service';

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { User } from '@/domain/core/enterprise/entities/user'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {

  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({ data })

    await this.prisma.favoriteCategory.createMany({
      data: user.favoriteCategories.getItems().map((favoriteCategory) => {
        return {
          userId: favoriteCategory.userId.toString(),
          categoryId: favoriteCategory.categoryId.toString()
        }
      })
    })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: { id: data.id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

}