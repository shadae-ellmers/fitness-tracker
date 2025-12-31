import { getAuth0UserId } from '@/lib/auth0/session'

export async function findOrCreateUser(session: { user?: unknown }) {
  const userId = getAuth0UserId(session)

  return prisma?.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  })
}
