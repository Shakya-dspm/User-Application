import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createSession, getCurrentUser, getUsers, initializeStorage, logout, registerUser, requestReset, resetPassword, verifyReset } from './storage.js'
import { emailValid, passwordValid } from '../utils/validation.js'

const store = new Map()
globalThis.localStorage = {
  getItem: key => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: key => store.delete(key),
}

beforeEach(() => { store.clear(); initializeStorage() })
afterEach(() => store.clear())

describe('user management demo utilities', () => {
  it('initializes eight sample users and preserves user changes', () => {
    assert.equal(getUsers().length, 8)
    registerUser({ name: 'Test Person', email: 'test@example.com', password: 'StrongPass1' })
    initializeStorage()
    assert.equal(getUsers().length, 9)
  })

  it('registers unique email addresses and rejects duplicates', () => {
    registerUser({ name: 'Test Person', email: 'test@example.com', password: 'StrongPass1' })
    assert.throws(() => registerUser({ name: 'Other Person', email: 'TEST@example.com', password: 'StrongPass1' }), /already exists/)
  })

  it('creates a persistent session and clears it on logout', () => {
    const user = getUsers()[0]
    createSession(user)
    assert.equal(getCurrentUser().id, user.id)
    logout()
    assert.equal(getCurrentUser(), null)
  })

  it('verifies a demo OTP and updates the password', () => {
    const user = getUsers()[0]
    const otp = requestReset(user.email)
    assert.throws(() => verifyReset('000000'), /not correct/)
    verifyReset(otp)
    resetPassword('NewStrong1')
    assert.equal(getUsers()[0].password, 'NewStrong1')
  })

  it('validates email and password rules', () => {
    assert.equal(emailValid('person@example.com'), true)
    assert.equal(emailValid('not-an-email'), false)
    assert.equal(passwordValid('SecurePass1'), true)
    assert.equal(passwordValid('weak'), false)
  })
})
