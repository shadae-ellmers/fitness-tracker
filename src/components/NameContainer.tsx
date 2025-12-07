'use client'

import { updateWorkoutName } from '@/app/actions/update'
import PencilIcon from './Icons/PencilIcon'
import styles from './styles/nameContainer.module.css'
import { useRef, useState } from 'react'

type NameContainerProps = {
  name: string
  workoutId: number
  userId: string
}

export default function NameContainer({
  name,
  workoutId,
  userId,
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

    await updateWorkoutName(workoutId, value, userId)
  }

  return (
    <div className={styles.nameContainer}>
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
          />
        </>
      ) : (
        <>
          <h1 className={styles.exerciseName}>{value}</h1>
          <button className={styles.pencilIcon} onClick={startEditing}>
            <PencilIcon />
          </button>
        </>
      )}
    </div>
  )
}
