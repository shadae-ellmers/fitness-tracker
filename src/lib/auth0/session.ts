import { isAuth0User } from './guards'

export function getAuth0UserId(session: { user?: unknown }): string {
  if (!session.user || !isAuth0User(session.user)) {
    throw new Error('Invalid Auth0 session')
  }

  return session.user.sub
}
