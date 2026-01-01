import { getLogs } from '../actions/read'
import { redirect } from 'next/navigation'
import styles from './logs.module.css'
import Search from '../ui/search'
import AddButton from '@/components/AddButton'
import DataCard from '@/components/DataCard'
import getUser from '../helpers/auth'
import SuccessMessage from '@/components/SuccessMessage'

export default async function Logs(props: {
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

  const logs = await getLogs(user.sub, query)

  return (
    <div className={styles.logs}>
      <div className={styles.filterHolder}>
        <AddButton path="logs" ariaLabel="Create log" />
        <Search placeholder="Search logs..." />
      </div>
      {status === 'success' ? <SuccessMessage name="log" path="logs" /> : <></>}
      {!logs.length && !query && <p className={styles.text}>No logs found</p>}
      {!logs.length && query && (
        <p className={styles.text}>No results found for &quot;{query}&quot;</p>
      )}
      {logs.length >= 1 && (
        <ul>
          {logs.map((log, index) => (
            <DataCard data={log} key={index} index={index} type="logs" />
          ))}
        </ul>
      )}
    </div>
  )
}
