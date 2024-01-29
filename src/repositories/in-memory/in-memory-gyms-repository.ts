import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

import { randomUUID } from 'crypto'

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
}
