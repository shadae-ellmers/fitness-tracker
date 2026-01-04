import type { Metadata } from 'next'
import './globals.css'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { findOrCreateUser } from './actions/auth'
import Header from '@/components/Header'
import getUser from './helpers/auth'

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Track fitness statistics',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  if (user) {
    await findOrCreateUser({ user: user })
  }

  return (
    <html lang="en">
      <body>
        <Auth0Provider>
          <main>
            <Header />
            {children}
          </main>
        </Auth0Provider>
      </body>
    </html>
  )
}
