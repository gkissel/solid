import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserService

describe('GetUserService', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserService(usersRepository)
  })

  it('should able to find a user', async () => {
    const name = 'Test User'

    const createdUser = await usersRepository.create({
      email: 'test@example.com',
      name,
      password_hash: 'HashedPassword',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user).toBeDefined()
    expect(user.name).toBe(name)
  })

  it('should not able to find a user with wrong id', async () => {
    const userId = 'user-2'

    await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      password_hash: 'HashedPassword',
    })

    await expect(() =>
      sut.execute({
        userId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
