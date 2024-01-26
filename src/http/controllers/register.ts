import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerService } from '@/services/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerUserBodySchema.parse(request.body)

  try {
    await registerService({ email, name, password })
  } catch (err) {
    return reply.status(409).send('User with same email already exists')
  }

  return reply.status(201).send()
}
