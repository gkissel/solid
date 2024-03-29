import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public registry: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')

    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.registry.find((checkIn) => {
      const CheckInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        CheckInDate.isAfter(startOfTheDay) && CheckInDate.isBefore(endOfTheDay)

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
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }
    this.registry.push(checkIn)

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.registry
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async findById(id: string) {
    const checkIn = this.registry.find((checkIn) => checkIn.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    return this.registry.filter((checkIn) => checkIn.user_id === userId).length
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.registry.findIndex(
      (registry) => registry.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.registry[checkInIndex] = checkIn
    }

    return checkIn
  }
}
