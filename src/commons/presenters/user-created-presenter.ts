import { User } from 'src/modules/users/entities/user.entity'

export class UserCreatedPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio
    }
  }
}