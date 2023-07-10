import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNeabyGymsUseCase } from '../featch-nearby-gyms'

export function makeFetchNeabyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNeabyGymsUseCase(gymsRepository)

  return useCase
}
