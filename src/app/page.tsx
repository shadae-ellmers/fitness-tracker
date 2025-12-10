import { auth0 } from '@/lib/auth0'
import styles from './home.module.css'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return <div className={styles.homePage}></div>
}
