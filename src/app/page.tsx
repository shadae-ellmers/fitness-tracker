import { auth0 } from '@/lib/auth0'
import styles from './home.module.css'

export default auth0.withPageAuthRequired(
  async function Page() {
    return <div></div>
  },
  { returnTo: '/auth/login' }
)
