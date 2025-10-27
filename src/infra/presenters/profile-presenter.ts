import { User } from '@/domain/core/enterprise/entities/user'

export class ProfilePresenter {

  static toHttp(user: User) {
    return {
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    }
  }

}