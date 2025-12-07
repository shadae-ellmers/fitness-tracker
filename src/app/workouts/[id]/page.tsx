import { getAllExercises, getWorkout } from '@/app/actions/read'
import { auth0 } from '@/lib/auth0'
import styles from './workout.module.css'
import { notFound, redirect } from 'next/navigation'
import BackLink from '@/components/BackLink'
import AllArrowsIcon from '@/components/Icons/AllArrowsIcon'
import NameContainer from '@/components/NameContainer'
import WorkoutToolbar from '@/components/WorkoutToolbar'

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth0.getSession()
  const user = session?.user

  if (!user) {
    redirect('/auth/login')
  }

  const workout = await getWorkout(params.id, user.sub)

  if (!workout) {
    notFound()
  }

  const exercises = await getAllExercises()

  return (
    <div className={styles.exercise}>
      <BackLink link="/workouts" />
      <NameContainer
        name={workout?.name}
        workoutId={workout.id}
        userId={user.sub}
      />
      <h2 className={styles.headingText}>Exercises</h2>
      {workout?.exercises.length === 0 ? (
        <p>No logs</p>
      ) : (
        <>
          <div className={styles.actions}>
            <WorkoutToolbar
              exercises={exercises}
              userId={user.sub}
              workoutId={workout.id}
            />
          </div>
          <ul>
            {workout?.exercises.map((exercise) => (
              <li key={exercise.id} className={styles.logItem}>
                <div className={styles.heading}>
                  <h3 className={styles.logItemName}>{exercise.name}</h3>
                </div>
                {exercise.personalBest ? (
                  <div className={styles.stats}>
                    <p className={styles.logItemStat}>
                      Personal best:{' '}
                      <span>{exercise.personalBest.weight}kg</span>
                    </p>
                    <p className={styles.logItemStat}>
                      Date: <span>{exercise.personalBest.created_at}</span>
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
