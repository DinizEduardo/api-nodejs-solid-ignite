import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { CheckInsRepository } from '../check-in-repository'

export class InMemoryCheckInsRepositoryRepository
  implements CheckInsRepository
{
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
