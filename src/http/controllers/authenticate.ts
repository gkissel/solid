import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

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
    const authenticateService = makeAuthenticateService()
    await authenticateService.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError)
      return reply.status(409).send({ message: err.message })

    throw err
  }

  return reply.status(200).send()
}
