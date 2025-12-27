import { getExercise } from '@/app/actions/read'
import styles from './exercise.module.css'
import { notFound, redirect } from 'next/navigation'
import BackLink from '@/components/BackLink'
import DataCard from '@/components/DataCard'
import getUser from '@/app/helpers/auth'
import NameContainer from '@/components/NameContainer'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()

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
      <NameContainer
        name={exercise?.name}
        primaryId={exercise.id}
        userId={user.sub}
        type="exercise"
      />
      {maxLog ? (
        <>
          <div className={styles.group}>
            <h2 className={styles.headingText}>Personal best</h2>
            <DataCard data={maxLog} index={0} type="personalBest" />
            <h2 className={styles.headingText}>All logs</h2>
            <ul>
              {exercise?.logs.map((log, index) => (
                <DataCard
                  data={log}
                  index={index}
                  key={index}
                  type="exerciseLog"
                  parentType="exercises"
                  parentId={exercise.id}
                />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.group}>
          <p>No data found</p>
        </div>
      )}
    </div>
  )
}
