import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('AuthenticateService', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should able to authenticate a user', async () => {
    const email = 'test@example.com'
    const name = 'Test User'
    const password = 'password123'

    const password_hash = await hash(password, 5)
    await usersRepository.create({
      email,
      name,
      password_hash,
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user).toBeDefined()
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
    expect(user.password_hash).toBe(password_hash)
  })

  it('should not able to authenticate with wrong email', async () => {
    const correct_email = 'test@example.com'
    const wrong_email = 'wrong@mail.com'
    const name = 'Test User'
    const password = 'password123'

    const password_hash = await hash(password, 5)
    await usersRepository.create({
      email: correct_email,
      name,
      password_hash,
    })

    await expect(() =>
      sut.execute({
        email: wrong_email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not able to authenticate with wrong email', async () => {
    const correct_password = 'password123'
    const wrong_password = '123password'
    const name = 'Test User'
    const email = 'test@example.com'

    const password_hash = await hash(correct_password, 5)
    await usersRepository.create({
      email,
      name,
      password_hash,
    })

    await expect(() =>
      sut.execute({
        email,
        password: wrong_password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
