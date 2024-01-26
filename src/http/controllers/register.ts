import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistError } from '@/services/errors/user-already-exist'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerUserBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()

    const registerService = new RegisterService(usersRepository)

    await registerService.execute({ email, name, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistError)
      return reply.status(409).send('User with same email already exists')

    return reply.status(500).send()
  }

  return reply.status(201).send()
}
