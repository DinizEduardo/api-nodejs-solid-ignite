import { InMemoryCheckInsRepositoryRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './checkin'

let checkInsRepository: InMemoryCheckInsRepositoryRepository
let sut: CheckInUseCase

describe('Check in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepositoryRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
