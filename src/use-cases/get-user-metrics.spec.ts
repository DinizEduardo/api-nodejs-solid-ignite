import { InMemoryCheckInsRepositoryRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepositoryRepository
let sut: GetUserMetricsUseCase

describe('Get User metrics use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepositoryRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check ins count', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
