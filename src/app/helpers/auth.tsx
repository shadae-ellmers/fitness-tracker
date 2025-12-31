import { auth0 } from '@/lib/auth0'
import type { Auth0User } from '@/lib/auth0/types'
import { isAuth0User } from '@/lib/auth0/guards'

export default async function getUser(): Promise<Auth0User | null> {
  const session = await auth0.getSession()

  if (!session?.user || !isAuth0User(session.user)) {
    return null
  }

  return session.user
}
