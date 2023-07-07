import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-in-repository'

export class InMemoryCheckInsRepositoryRepository
  implements CheckInsRepository
{
  public items: CheckIn[] = []

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

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
