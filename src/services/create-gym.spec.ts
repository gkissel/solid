import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymService } from './create-gym'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: GymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should create a new gym', async () => {
    const { gym } = await sut.execute({
      description: 'description',
      latitude: -27.6463616,
      longitude: -52.2584064,
      name: 'Gym 01',
      phone: '00000000000',
    })

    expect(gym).toBeDefined()
  })
})
