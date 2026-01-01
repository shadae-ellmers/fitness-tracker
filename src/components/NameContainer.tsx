'use client'

import { updateExerciseName, updateWorkoutName } from '@/app/actions/update'
import PencilIcon from './Icons/PencilIcon'
import styles from './styles/nameContainer.module.css'
import { useRef, useState } from 'react'
import CheckIcon from './Icons/CheckIcon'
import CloseIcon from './Icons/CloseIcon'

interface NameContainerProps {
  name: string
  primaryId: number
  userId: string
  type: string
}

export default function NameContainer({
  name,
  primaryId,
  userId,
  type,
}: NameContainerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(name)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const startEditing = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const saveName = async () => {
    setIsEditing(false)

    if (value.trim() === '' || value === name) return

    if (type === 'workout') {
      await updateWorkoutName(primaryId, value, userId)
    } else if (type === 'exercise') {
      await updateExerciseName(primaryId, value, userId)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue(name)
  }

  return (
    <div className={styles.nameContainer}>
      {isEditing ? (
        <form className={styles.form} onSubmit={saveName}>
          <input
            ref={inputRef}
            className={styles.input}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.checkIcon}
              disabled={!isEditing}
              aria-label="Save"
            >
              <CheckIcon />
            </button>
            <button
              type="button"
              className={styles.closeIcon}
              disabled={!isEditing}
              aria-label="Cancel"
              onClick={handleCancel}
            >
              <CloseIcon />
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className={styles.exerciseName}>{value}</h1>
          <button
            className={styles.pencilIcon}
            onClick={startEditing}
            aria-label="Edit title"
          >
            <PencilIcon />
          </button>
        </>
      )}
    </div>
  )
}
