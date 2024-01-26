import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface registerServiceProps {
  email: string
  name: string
  password: string
}

export async function registerService({
  email,
  name,
  password,
}: registerServiceProps) {
  const password_hash = await hash(password, 5)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('User with same email already exists')
  }

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    email,
    name,
    password_hash,
  })
}
