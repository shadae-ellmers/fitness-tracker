import { getExercises } from '../actions/read'
import { redirect } from 'next/navigation'
import styles from './exercises.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'
import DataCard from '@/components/DataCard'
import getUser from '../helpers/auth'
import SuccessMessage from '@/components/SuccessMessage'

export default async function Exercises(props: {
  searchParams?: Promise<{
    query?: string
    status?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query ?? ''
  const status = searchParams?.status ?? ''

  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const exercises = await getExercises(user.sub, query)

  return (
    <div className={styles.logs}>
      <div className={styles.filterHolder}>
        <AddButton path="exercises" ariaLabel="Create exercise" />
        <Search placeholder="Search exercises..." />
      </div>
      {status === 'success' ? (
        <SuccessMessage name="exercise" path="exercises" />
      ) : (
        <></>
      )}
      {!exercises.length && !query && (
        <p className={styles.text}>No exercises found</p>
      )}
      {!exercises.length && query && (
        <p className={styles.text}>No results found for &quot;{query}&quot;</p>
      )}
      {exercises.length >= 1 && (
        <ul>
          {exercises.map((exercise, index) => (
            <DataCard
              data={exercise}
              index={index}
              key={index}
              type="exercises"
            />
          ))}
        </ul>
      )}
    </div>
  )
}
