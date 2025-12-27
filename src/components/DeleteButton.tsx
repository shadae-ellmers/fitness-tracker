'use client'

import {
  deleteExercise,
  deleteLog,
  deleteWorkout,
  deleteWorkoutExercise,
} from '@/app/actions/delete'
import styles from './styles/actionButton.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TrashIcon from './Icons/TrashIcon'

type DeleteButtonProps = {
  primaryId: number
  secondaryId?: number | undefined
  action: string
  name: string
  path: string
}

export default function DeleteButton({
  primaryId,
  secondaryId,
  action,
  name,
  path,
}: DeleteButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const deleteItem = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (action === 'workoutExercise' && secondaryId) {
        await deleteWorkoutExercise(secondaryId, primaryId)
      } else if (action === 'workouts') {
        await deleteWorkout(primaryId)
      } else if (action === 'exercises') {
        await deleteExercise(primaryId)
      } else if (action === 'logs') {
        await deleteLog(primaryId)
      }
      router.push(path)
      setShowDialog(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <button
        className={styles.deleteButton}
        onClick={() => setShowDialog(true)}
        aria-label={`Delete ${name}`}
      >
        <TrashIcon />
      </button>
      {showDialog && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete {name}?</p>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => setShowDialog(false)}
                className={styles.cancel}
              >
                Cancel
              </button>
              <button onClick={deleteItem} className={styles.submit}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
