'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './styles/addForm.module.css'
import { addWorkout } from '@/app/actions/create'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0'
import Select, { MultiValue } from 'react-select'

type AddWorkoutFormProps = {
  exercises: Exercise[]
}

type Exercise = {
  id: number
  name: string
}

export default function AddWorkoutForm({ exercises }: AddWorkoutFormProps) {
  const { user } = useUser()

  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    exerciseIds: [] as number[],
  })

  const [formError, setFormError] = useState<string | null>(null)

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (!user?.sub) {
        return
      }

      await addWorkout({
        userId: user.sub,
        name: formData.name,
        exerciseIds: selectedExercises.map((ex) => ex.id),
      })

      router.push('/workouts?status=success')
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong.'
      setFormError(message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          Name
          <input
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.selectField}>
          Exercises
          <Select
            isMulti
            options={exercises.map((ex) => ({ value: ex.id, label: ex.name }))}
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
                backgroundColor: '#fff',
                border: '0',
              }),
              indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                display: 'none',
              }),
            }}
          />
        </label>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
      {formError && <p className={styles.error}>{formError}</p>}
    </>
  )
}
