import { getLogs } from '../actions/read'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import styles from './logs.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'

export default async function Logs(props: {
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

  const logs = await getLogs(session.user.sub, query)

  return (
    <div className={styles.logs}>
      <div className={styles.filterHolder}>
        <AddButton path="logs" ariaLabel="Create log" />
        <Search placeholder="Search logs..." />
      </div>
      {status === 'success' ? (
        <div className={styles.successMessage}>
          <h3 className={styles.successText}>Log successfully added</h3>
        </div>
      ) : (
        <></>
      )}
      <ul>
        {logs.map((log, index) => (
          <li key={index} className={styles.logItem}>
            <div className={styles.heading}>
              <h3 className={styles.logItemName}>{log.exercise.name}</h3>
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
    </div>
  )
}
