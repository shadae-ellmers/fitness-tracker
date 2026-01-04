import BackLink from '@/components/BackLink'
import styles from './addPage.module.css'
import { redirect } from 'next/navigation'
import { getAllExercises } from '@/app/actions/read'
import AddLogForm from '@/components/AddLogForm'
import getUser from '@/app/helpers/auth'

export default async function AddLog() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const exercises = await getAllExercises(user.sub)

  return (
    <div className={styles.addPage}>
      <BackLink link="/logs" />
      <AddLogForm exercises={exercises} />
    </div>
  )
}
