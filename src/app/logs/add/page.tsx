import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { getAllExercises } from '@/app/actions/read'
import AddLogForm from '@/components/AddLogForm'

export default async function AddLog() {
  const session = await auth0.getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const exercises = await getAllExercises()

  return (
    <div className={styles.addPage}>
      <BackLink link="/logs" />
      <AddLogForm exercises={exercises} />
    </div>
  )
}
