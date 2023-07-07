import { CheckInsRepository } from '@/repositories/check-in-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInValidateUseCaseRequest {
  checkInId: string
}

interface CheckInValidateUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInValidateUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: CheckInValidateUseCaseRequest): Promise<CheckInValidateUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
