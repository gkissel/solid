import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserService } from '../get-user-profile'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository()

  const service = new GetUserService(usersRepository)

  return service
}
