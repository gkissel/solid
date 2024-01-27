import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { AuthenticateService } from '@/services/authenticate'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateUserBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()

    const authenticateService = new AuthenticateService(usersRepository)

    const { user } = await authenticateService.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError)
      return reply.status(409).send({ message: err.message })

    throw err
  }

  return reply.status(200).send()
}
