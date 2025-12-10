import type { Metadata } from 'next'
import './globals.css'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { auth0 } from '@/lib/auth0'
import { findOrCreateUser } from './actions/auth'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Track fitness statistics',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth0.getSession()

  if (session?.user) {
    await findOrCreateUser({ user: session.user })
  }

  return (
    <html lang="en">
      <body>
        <Auth0Provider>
          <Header />
          {children}
        </Auth0Provider>
      </body>
    </html>
  )
}
