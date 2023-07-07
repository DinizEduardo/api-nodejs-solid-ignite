import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNeabyGymsUseCase } from './featch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNeabyGymsUseCase

describe('Search Nearby Gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNeabyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -27,
      longitude: -49,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
