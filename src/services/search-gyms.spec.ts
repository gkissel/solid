import { expect, describe, it, beforeEach } from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymService } from './search-gyms'

let gymsRepository: GymsRepository
let sut: SearchGymService

describe('Search Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymService(gymsRepository)
  })

  it('should Search a gym', async () => {
    await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
      description: 'description',
      phone: '00000000000',
    })

    await gymsRepository.create({
      name: 'Gym 02',
      latitude: 0,
      longitude: 0,
      description: 'description',
      phone: '00000000000',
    })

    const { gyms } = await sut.execute({
      page: 1,
      query: 'Gym 01',
    })

    expect(gyms).toBeDefined()
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ name: 'Gym 01' })])
  })

  it('should Search a gym with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
        description: 'description',
        phone: '00000000000',
      })
    }

    const { gyms } = await sut.execute({
      page: 2,
      query: 'Gym',
    })

    expect(gyms).toBeDefined()
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Gym 21' }),
      expect.objectContaining({ name: 'Gym 22' }),
    ])
  })
})
