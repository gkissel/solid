import { makeFetchNearbyGymsService } from '@/services/factories/make-fetch-nearby-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query)

  const fetchNearbyGymsService = makeFetchNearbyGymsService()

  const { gyms } = await fetchNearbyGymsService.execute({
    userLongitude: longitude,
    userLatitude: latitude,
  })

  return reply.status(200).send({ gyms })
}
