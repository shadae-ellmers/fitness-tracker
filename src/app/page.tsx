import styles from './home.module.css'
import { redirect } from 'next/navigation'
import { getProgress, getProgressLastMonth } from './actions/read'
import ProgressChart from '@/components/Charts/ProgressChart'
import getUser from './helpers/auth'

export default async function Page() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userId = user.sub

  const progress = await getProgress(userId)

  const lastMonthProgress = await getProgressLastMonth(userId)

  return (
    <div className={styles.homePage}>
      <h2>Past month progress</h2>
      <div className={styles.progress}>
        <ProgressChart data={lastMonthProgress} dateRange="month" />
      </div>
      <h2>Overall progress</h2>
      <div className={styles.progress}>
        <ProgressChart data={progress} />
      </div>
    </div>
  )
}
