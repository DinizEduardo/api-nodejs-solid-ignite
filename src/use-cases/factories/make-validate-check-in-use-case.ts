import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInValidateUseCase } from '../validate-check-in'

export function MakeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new CheckInValidateUseCase(checkInRepository)

  return useCase
}
