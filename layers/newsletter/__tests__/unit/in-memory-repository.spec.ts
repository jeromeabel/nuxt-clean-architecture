// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { createInMemoryRepository, ERRORS } from '../../repositories/in-memory-newsletter-repository'
import type { INewsletterRepository } from '../../domain/ports/newsletter-repository-interface'
import { createSubscriber } from '../../domain/entities/subscriber'
import { failure, success } from '~/shared/result'

describe('InMemoryRepository', () => {
  let repository: INewsletterRepository

  beforeEach(() => {
    repository = createInMemoryRepository()
  })

  it('should successfully add new subscribers', async () => {
    const newSubscriber1 = createSubscriber('test1@example.com')
    const newSubscriber2 = createSubscriber('test2@example.com')

    const result1 = await repository.add(newSubscriber1)
    expect(result1).toEqual(success({ id: '1', email: newSubscriber1.email }))

    const result2 = await repository.add(newSubscriber2)
    expect(result2).toEqual(success({ id: '2', email: newSubscriber2.email }))
  })

  it('should fail when adding duplicate subscribers', async () => {
    const subscriber = createSubscriber('test@example.com')
    await repository.add(subscriber)

    const result = await repository.add(subscriber)

    expect(result.success).toBe(false)
    expect(result).toEqual(failure(ERRORS.DUPLICATE_EMAIL))
  })

  it('should retrieve a subscriber by email', async () => {
    const subscriber = createSubscriber('test@example.com')
    await repository.add(subscriber)

    const result = await repository.getByEmail('test@example.com')
    expect(result).toEqual(success({ id: '1', email: 'test@example.com' }))
  })

  it('should fail when trying to retrieve a non-existent subscriber', async () => {
    const result = await repository.getByEmail('test@example.com')
    expect(result).toEqual(failure(ERRORS.SUBSCRIBER_NOT_FOUND))
  })
})
