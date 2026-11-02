import '@testing-library/jest-dom'
import { vi } from 'vitest'
import axios from 'axios'

const mockGet = vi.fn()

vi.mock('axios', () => ({
  default: {
    get: mockGet,
    create: vi.fn(() => ({
      get: vi.fn(),
    })),
  },
}))

beforeEach(() => {
  mockGet.mockReset()
  mockGet.mockResolvedValue({ data: { varieties: [] } })
})
