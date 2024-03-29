import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, FindManyNearbyParams } from '../gyms-repository'

import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public registries: Gym[] = []

  async findById(id: string) {
    const gym = this.registries.find((registry) => registry.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.registries.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.registries
      .filter((registry) => registry.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.registries.filter((registry) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: registry.latitude.toNumber(),
          longitude: registry.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
