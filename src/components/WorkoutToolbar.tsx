'use client'

import { useState } from 'react'
import Select, { MultiValue } from 'react-select'
import PlusIcon from './Icons/PlusIcon'
import CheckIcon from './Icons/CheckIcon'
import styles from './styles/workoutToolbar.module.css'
import { updateWorkoutExercises } from '@/app/actions/update'

type Exercise = {
  id: number
  name: string
}

type WorkoutToolbarProps = {
  workoutId: number
  userId: string
  exercises: Exercise[]
  exerciseCount: number
}

export default function WorkoutToolbar({
  workoutId,
  userId,
  exercises,
}: WorkoutToolbarProps) {
  const [displayForm, setDisplayForm] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateWorkoutExercises(
        workoutId,
        selectedExercises.map((ex) => ex.id),
        userId
      )
      setDisplayForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSelectedExercises([])
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarButtons}>
        <button
          className={styles.plusIcon}
          onClick={() => {
            setDisplayForm(!displayForm)
          }}
          aria-label="Add exercises to workout"
        >
          <PlusIcon />
        </button>
      </div>

      {displayForm && (
        <form className={styles.form} onSubmit={() => onSubmit}>
          <label className={styles.select}>
            <Select
              isMulti
              options={exercises.map((ex) => ({
                value: ex.id,
                label: ex.name,
              }))}
              value={selectedExercises.map((ex) => ({
                value: ex.id,
                label: ex.name,
              }))}
              onChange={(
                selected: MultiValue<{ value: number; label: string }>
              ) => {
                setSelectedExercises(
                  selected.map((s) => ({ id: s.value, name: s.label }))
                )
              }}
              placeholder="Search and select exercises..."
              className={styles.fieldSelectInput}
              styles={{
                valueContainer: (baseStyles) => ({
                  ...baseStyles,
                  padding: '20px',
                }),
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '30px',
                  overflow: 'hidden',
                  backgroundColor: '#faf4e4',
                  color: '#19160f',
                  border: '2px solid #19160f',
                }),
                indicatorSeparator: (baseStyles) => ({
                  ...baseStyles,
                  display: 'none',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#faf4e4',
                  color: '#19160f',
                }),
              }}
            />
          </label>

          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.checkIcon}
              disabled={isSaving}
              aria-label="Save"
            >
              <CheckIcon />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
