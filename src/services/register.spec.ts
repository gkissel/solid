import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { UserAlreadyExistError } from './errors/user-already-exist'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/im-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Services', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })
  it('should create a new user', async () => {
    // Arrange

    const email = 'test@example.com'
    const name = 'Test User'
    const password = 'password123'

    // Act
    await sut.execute({ email, name, password })

    // Assert
    const createdUser = await usersRepository.findByEmail(email)
    expect(createdUser).toBeDefined()
    expect(createdUser?.email).toBe(email)
    expect(createdUser?.name).toBe(name)
  })

  it('should throw an error if user with same email already exists', async () => {
    // Arrange
    const email = 'existing@example.com'

    // Create a user with the same email
    await sut.execute({
      email,
      name: 'Existing User',
      password: 'password123',
    })
    // Act & Assert

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should hash the password before saving', async () => {
    // Arrange

    const { user } = await sut.execute({
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
