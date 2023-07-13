import { MakeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInQuerySchema = z.object({
    checkInId: z.string(),
  })

  const { checkInId } = validateCheckInQuerySchema.parse(request.params)

  const makeValidateCheckInUseCase = MakeValidateCheckInUseCase()

  await makeValidateCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
