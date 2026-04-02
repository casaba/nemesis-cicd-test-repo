export const DEMO_JWT_SECRET = 'demo-super-secret-jwt-key-rotate-me'

export function buildUserLookupQuery (email: string) {
  return `SELECT * FROM Users WHERE email = '${email}'`
}
