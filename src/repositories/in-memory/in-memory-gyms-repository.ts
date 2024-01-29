import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public registrys: Gym[] = []

  async findById(id: string) {
    const gym = this.registrys.find((registry) => registry.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
