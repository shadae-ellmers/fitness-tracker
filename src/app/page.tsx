import { auth0 } from '@/lib/auth0'
import styles from './home.module.css'
import { redirect } from 'next/navigation'
import {
  getHeatmapData,
  getProgress,
  getProgressLastMonth,
} from './actions/read'
import ProgressChart from '@/components/Charts/ProgressChart'
import Heatmap from '@/components/Heatmap'

export default async function Page() {
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const userId = session.user.sub

  const progress = await getProgress(userId)

  const lastMonthProgress = await getProgressLastMonth(userId)

  const data = await getHeatmapData(userId)

  return (
    <div className={styles.homePage}>
      <h2>Past month progress</h2>
      <div className={styles.progress}>
        <ProgressChart data={lastMonthProgress} />
      </div>
      <div className={styles.progress}>
        <Heatmap data={data} />
      </div>
      <h2>Overall progress</h2>
      <div className={styles.progress}>
        <ProgressChart data={progress} />
      </div>
    </div>
  )
}
