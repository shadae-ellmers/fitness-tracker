import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import AddWorkoutForm from '@/components/AddWorkoutForm'
import { getAllExercises } from '@/app/actions/read'

export default async function AddWorkout() {
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const exercises = await getAllExercises(session.user.sub)

  return (
    <div className={styles.addPage}>
      <BackLink link="/workouts" />
      <AddWorkoutForm exercises={exercises} />
    </div>
  )
}
