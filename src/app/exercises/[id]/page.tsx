import { getExercise } from '@/app/actions/read'
import { auth0 } from '@/lib/auth0'
import styles from './exercise.module.css'
import { notFound, redirect } from 'next/navigation'
import BackLink from '@/components/BackLink'

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth0.getSession()
  const user = session?.user

  if (!user) {
    redirect('/auth/login')
  }

  const exercise = await getExercise(params.id, user.sub)

  if (!exercise) {
    notFound()
  }

  const { maxLog } = exercise

  return (
    <div className={styles.exercise}>
      <BackLink link="/exercises" />
      <h1 className={styles.exerciseName}>{exercise?.name}</h1>
      <div className={styles.group}>
        <h2 className={styles.headingText}>Personal best</h2>
        {maxLog ? (
          <div className={styles.logItem}>
            <p>{Number(maxLog?.weight)}kg</p>
            <p>{Number(maxLog?.reps)} reps</p>
            <p>{Number(maxLog?.sets)} sets</p>
            <p>{maxLog?.created_at}</p>
          </div>
        ) : (
          <p>No personal best</p>
        )}
      </div>

      <h2 className={styles.headingText}>All logs</h2>
      {exercise?.logs.length === 0 ? (
        <p>No logs</p>
      ) : (
        <ul>
          {exercise?.logs.map((log) => (
            <li key={log.id} className={styles.logItem}>
              <div className={styles.heading}>
                <h3 className={styles.logItemName}>{exercise.name}</h3>
                <h4 className={styles.logItemDate}>{log.created_at}</h4>
              </div>
              <p className={styles.logItemStat}>
                Weight: <span>{log.weight}kg</span>
              </p>
              <p className={styles.logItemStat}>
                Reps: <span>{log.reps}</span>
              </p>
              <p className={styles.logItemStat}>
                Sets: <span>{log.sets}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
