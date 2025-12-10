'use client'

import { deleteWorkout, deleteWorkoutExercise } from '@/app/actions/delete'
import CloseIcon from './Icons/CloseIcon'
import styles from './styles/actionButton.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type DeleteButtonProps = {
  primaryId: number
  secondaryId?: number
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

  const deleteItem = async () => {
    try {
      if (action === 'deleteWorkoutExercise') {
        await deleteWorkoutExercise(primaryId, secondaryId)
      } else if (action === 'deleteWorkout') {
        await deleteWorkout(primaryId)
      }
      router.push(path)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <button
        className={styles.deleteButton}
        onClick={() => setShowDialog(true)}
      >
        <CloseIcon />
      </button>
      {showDialog && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete {name}?</p>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => setShowDialog(false)}
                className={styles.dialogButton}
              >
                Cancel
              </button>
              <button onClick={deleteItem} className={styles.dialogButton}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
