import { InMemoryCheckInsRepositoryRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInValidateUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepositoryRepository
let sut: CheckInValidateUseCase

describe('Validate check in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepositoryRepository()
    sut = new CheckInValidateUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('should not be able to validate the check-in after 20 minutes', async () => {
    vi.setSystemTime(new Date(2023, 7, 7, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(async () => {
      await sut.execute({ checkInId: createdCheckIn.id })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
