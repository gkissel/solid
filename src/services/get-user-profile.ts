import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserServiceRequest {
  userId: string
}

interface GetUserServiceResponse {
  user: User
}

export class GetUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
