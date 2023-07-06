import { InMemoryCheckInsRepositoryRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './checkin'

let checkInsRepository: InMemoryCheckInsRepositoryRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepositoryRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Academia',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: 0,
          userLongitude: 0,
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6425659),
      longitude: new Decimal(-46.6172414),
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.5733614,
        userLongitude: -46.3889487,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
