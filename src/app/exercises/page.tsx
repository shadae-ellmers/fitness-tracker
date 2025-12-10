import { getExercises } from '../actions/read'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import styles from './exercises.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'
import Link from 'next/link'

export default async function Exercises(props: {
  searchParams?: Promise<{
    query?: string
    status?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const status = searchParams?.status || ''
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const exercises = await getExercises(query)

  return (
    <div className={styles.logs}>
      <div className={styles.filterHolder}>
        <AddButton path="exercises" />
        <Search placeholder="Search exercises..." />
      </div>
      {status === 'success' ? (
        <div className={styles.successMessage}>
          <h3 className={styles.successText}>Exercise successfully added</h3>
        </div>
      ) : (
        <></>
      )}
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id} className={styles.listItem}>
            <Link href={`/exercises/${exercise.id}`} className={styles.logItem}>
              <h3 className={styles.logItemName}>{exercise.name}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
