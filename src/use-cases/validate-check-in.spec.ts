import { InMemoryCheckInsRepositoryRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInValidateUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepositoryRepository
let sut: CheckInValidateUseCase

describe('Validate check in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepositoryRepository()
    sut = new CheckInValidateUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check in', async () => {
    await expect(
      async () =>
        await sut.execute({
          checkInId: 'inexistent-check-in-id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
