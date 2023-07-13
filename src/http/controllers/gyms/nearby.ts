import { makeFetchNeabyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const featchNeabyQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = featchNeabyQuerySchema.parse(request.query)

  const neabyGymsUseCase = makeFetchNeabyGymsUseCase()

  const { gyms } = await neabyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
