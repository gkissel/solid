import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-og-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      name: 'Gym 01',
      description: 'Gym 01',
      latitude: -27.6463616,
      longitude: -52.2584064,
      phone: '00000000000',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',

      userLatitude: -27.6463616,
      userLongitude: -52.2584064,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.6463616,
      userLongitude: -52.2584064,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',

        userLatitude: -27.6463616,
        userLongitude: -52.2584064,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',

      userLatitude: -27.6463616,
      userLongitude: -52.2584064,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',

      userLatitude: -27.6463616,
      userLongitude: -52.2584064,
    })

    expect(checkIn).toBeDefined()
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.registries.push({
      id: 'gym-02',
      name: 'Gym 02',
      description: 'Gym 02',
      latitude: new Decimal(-27.5023552),
      longitude: new Decimal(-52.1496985),
      phone: '00000000000',
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',

        userLatitude: -27.6463616,
        userLongitude: -52.2584064,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
