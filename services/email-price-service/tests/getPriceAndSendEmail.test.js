import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handler } from '../handlers/getPriceAndSendEmail.js'

vi.mock('../services/priceService.js', () => ({
  getCryptoPrice: vi.fn(() => Promise.resolve(42000)),
}))

vi.mock('../services/emailService.js', () => ({
  sendEmail: vi.fn(() => Promise.resolve()),
}))

vi.mock('../services/searchRecordService.js', () => ({
  saveSearch: vi.fn(() => Promise.resolve()),
}))

describe('getPriceAndSendEmail.handler', () => {
  const baseHeaders = {
    'Content-Type': 'application/json',
  }

  const validEvent = {
    headers: baseHeaders,
    body: JSON.stringify({
      symbol: 'BTC',
      email: 'test@example.com',
    }),
  }

  it('should return 200 on valid request', async () => {
    const response = await handler(validEvent)

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)
    expect(body.message).toContain('Email sent to test@example.com')
  })

  it('should return 400 if email is missing', async () => {
    const event = {
      headers: baseHeaders,
      body: JSON.stringify({
        symbol: 'BTC',
      }),
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.message).toMatch(/missing.*email/i)
  })

  it('should return 400 if symbol is invalid', async () => {
    const event = {
      headers: baseHeaders,
      body: JSON.stringify({
        symbol: 123,
        email: 'test@example.com',
      }),
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.message).toMatch(/invalid.*symbol/i)
  })

  it('should return 400 if email is invalid', async () => {
    const event = {
      headers: baseHeaders,
      body: JSON.stringify({
        symbol: 'BTC',
        email: 'not-an-email',
      }),
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.message).toMatch(/invalid.*email/i)
  })
})
