import { auth0 } from '@/lib/auth0'

export default async function getUser() {
  const session = await auth0.getSession()

  return session?.user
}
