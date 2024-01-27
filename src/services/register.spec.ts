import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { UserAlreadyExistError } from './errors/user-already-exist'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/im-memory-users-repository'

describe('Register Services', () => {
  it('should create a new user', async () => {
    // Arrange
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)
    const email = 'test@example.com'
    const name = 'Test User'
    const password = 'password123'

    // Act
    await registerService.execute({ email, name, password })

    // Assert
    const createdUser = await usersRepository.findByEmail(email)
    expect(createdUser).toBeDefined()
    expect(createdUser?.email).toBe(email)
    expect(createdUser?.name).toBe(name)
  })

  it('should throw an error if user with same email already exists', async () => {
    // Arrange
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)
    const email = 'existing@example.com'

    // Create a user with the same email
    await registerService.execute({
      email,
      name: 'Existing User',
      password: 'password123',
    })
    // Act & Assert

    expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should hash the password before saving', async () => {
    // Arrange

    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
