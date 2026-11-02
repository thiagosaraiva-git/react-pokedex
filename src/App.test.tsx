import { describe, it, expect } from 'vitest'

describe('Smoke test', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4)
  })
})
