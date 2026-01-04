import { getWorkouts } from '../actions/read'
import { redirect } from 'next/navigation'
import styles from './workouts.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'
import DataCard from '@/components/DataCard'
import getUser from '../helpers/auth'
import SuccessMessage from '@/components/SuccessMessage'

export default async function Workouts(props: {
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

  const workouts = await getWorkouts(user.sub, query)

  return (
    <div className={styles.logs}>
      <div className={styles.filterHolder}>
        <AddButton path="workouts" ariaLabel="Create workout" />
        <Search placeholder="Search workouts..." />
      </div>
      {status === 'success' ? (
        <SuccessMessage name="workout" path="workouts" />
      ) : (
        <></>
      )}
      {!workouts.length && !query && (
        <p className={styles.text}>No workouts found</p>
      )}
      {!workouts.length && query && (
        <p className={styles.text}>No results found for &quot;{query}&quot;</p>
      )}
      {workouts.length >= 1 && (
        <ul>
          {workouts.map((workout, index) => (
            <DataCard
              data={workout}
              index={index}
              key={index}
              type="workouts"
            />
          ))}
        </ul>
      )}
    </div>
  )
}
