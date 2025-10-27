import { Prisma, User as PrismaUser } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/core/enterprise/entities/user'

export class PrismaUserMapper {

  static toDomain(raw: PrismaUser): User {
    return User.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      bio: raw.bio,
      profilePicture: raw.profilePicture
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      bio: user.bio,
      profilePicture: user.profilePicture
    }
  }
}