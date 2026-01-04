import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { redirect } from 'next/navigation'
import AddExerciseForm from '@/components/AddExerciseForm'
import getUser from '@/app/helpers/auth'

export default async function AddExercisePage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className={styles.addPage}>
      <BackLink link="/exercises" />
      <AddExerciseForm userId={user.sub} />
    </div>
  )
}
