import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { redirect } from 'next/navigation'
import AddWorkoutForm from '@/components/AddWorkoutForm'
import { getAllExercises } from '@/app/actions/read'
import getUser from '@/app/helpers/auth'

export default async function AddWorkout() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const exercises = await getAllExercises(user.sub)

  return (
    <div className={styles.addPage}>
      <BackLink link="/workouts" />
      <AddWorkoutForm exercises={exercises} />
    </div>
  )
}
