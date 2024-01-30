import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistError } from '@/services/errors/user-already-exist'
import { makeRegisterService } from '@/services/factories/make-register-service'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerUserBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterService()

    await registerService.execute({ email, name, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistError)
      return reply.status(409).send({ message: err.message })

    throw err
  }

  return reply.status(201).send()
}
