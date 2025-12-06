import prisma from '../../../prisma/prisma'

type SessionUser = {
  sub: string
}

type Session = {
  user: SessionUser
}

export async function findOrCreateUser(session: Session) {
  const userId = session.user.sub

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
    },
  })

  return user
}
