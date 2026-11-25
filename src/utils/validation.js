export const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const passwordValid = value => value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)
export const passwordHint = 'Use at least 8 characters, including uppercase, lowercase, and a number.'
