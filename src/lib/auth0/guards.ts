import { Auth0User } from './types'

export function isAuth0User(user: unknown): user is Auth0User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'sub' in user &&
    typeof (user as Record<string, unknown>).sub === 'string'
  )
}
