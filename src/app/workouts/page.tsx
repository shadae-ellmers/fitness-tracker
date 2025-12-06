import { getWorkouts } from '../actions/read'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import styles from './workouts.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'

export default auth0.withPageAuthRequired(
  async function Workouts(props: {
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

    const workouts = await getWorkouts(session.user.sub, query)

    const getWord = (count: number) => {
      if (count === 1) {
        return 'exercise'
      }

      return 'exercises'
    }

    return (
      <div className={styles.logs}>
        <div className={styles.filterHolder}>
          <AddButton path="workouts" />
          <Search placeholder="Search workouts..." />
        </div>
        {status === 'success' ? (
          <div className={styles.successMessage}>
            <h3 className={styles.successText}>Workout successfully added</h3>
          </div>
        ) : (
          <></>
        )}
        <ul>
          {workouts.map((workout, index) => (
            <li key={index} className={styles.logItem}>
              <div className={styles.heading}>
                <h3 className={styles.logItemName}>{workout.name}</h3>
              </div>
              <p className={styles.logItemStat}>
                {workout.exerciseCount} {getWord(workout.exerciseCount)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  { returnTo: '/auth/login' }
)
