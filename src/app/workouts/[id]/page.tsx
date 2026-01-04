import {
  getAllExercisesExcludingExisting,
  getWorkout,
} from '@/app/actions/read'
import styles from './workout.module.css'
import { notFound, redirect } from 'next/navigation'
import BackLink from '@/components/BackLink'
import NameContainer from '@/components/NameContainer'
import WorkoutToolbar from '@/components/WorkoutToolbar'
import DataCard from '@/components/DataCard'
import getUser from '@/app/helpers/auth'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const workout = await getWorkout(params.id, user.sub)

  if (!workout) {
    notFound()
  }

  const exercises = await getAllExercisesExcludingExisting(user.sub, workout.id)

  return (
    <div className={styles.exercise}>
      <BackLink link="/workouts" />
      <NameContainer
        name={workout.name}
        primaryId={workout.id}
        userId={user.sub}
        type="workout"
      />
      <h2 className={styles.headingText}>Exercises</h2>
      <div className={styles.actions}>
        <WorkoutToolbar
          exercises={exercises}
          userId={user.sub}
          workoutId={workout.id}
          exerciseCount={workout.exercises.length}
        />
      </div>
      {workout.exercises.length >= 1 && (
        <ul>
          {workout.exercises.map((exercise, index) => (
            <DataCard
              data={exercise}
              index={index}
              key={index}
              type="workoutExercise"
              parentType="workouts"
              parentId={workout.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
