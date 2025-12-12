import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import AddExerciseForm from '@/components/AddExerciseForm'

export default async function AddExercisePage() {
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className={styles.addPage}>
      <BackLink link="/exercises" />
      <AddExerciseForm userId={session.user.sub} />
    </div>
  )
}
