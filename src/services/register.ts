import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface registerServiceProps {
  email: string
  name: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: registerServiceProps) {
    const password_hash = await hash(password, 5)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('User with same email already exists')
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
