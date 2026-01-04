'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './styles/addForm.module.css'
import { addLog } from '@/app/actions/create'
import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Select from 'react-select'

interface AddLogFormProps {
  exercises: Exercise[]
}

interface Exercise {
  id: number
  name: string
}

interface SelectOption {
  value: number
  label: string
}

export default function AddLogForm({ exercises }: AddLogFormProps) {
  const { user } = useUser()

  const router = useRouter()

  const getNowForDatetimeLocal = (): string => {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Pacific/Auckland',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .replace(', ', 'T')
  }

  const [formData, setFormData] = useState({
    date: getNowForDatetimeLocal(),
    weight: '',
    reps: '',
    sets: '',
  })

  const [formSubmitState, setFormSubmitState] = useState(String)

  const [selectedExercise, setSelectedExercise] = useState<SelectOption | null>(
    null
  )

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (!user?.sub || selectedExercise == null) {
        return
      }

      const localDate = formData.date
      const utcDate = new Date(localDate).toISOString()

      await addLog({
        userId: user.sub,
        exerciseId: selectedExercise.value,
        weight: Number(formData.weight),
        reps: Number(formData.reps),
        sets: Number(formData.sets),
        date: utcDate,
      })

      router.push('/logs?status=success')
    } catch (err) {
      setFormSubmitState('error')
      console.error(err)
    }
  }

  const uniqueId = 'logForm-addExercise'

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          Exercise
          <Select
            required
            instanceId={uniqueId}
            isMulti={false}
            options={exercises.map((ex) => ({ value: ex.id, label: ex.name }))}
            value={selectedExercise}
            onChange={(selected) => {
              setSelectedExercise(selected as SelectOption | null)
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
        <label className={styles.field}>
          Date
          <input
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Weight (kg)
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.25"
            required
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Reps
          <input
            name="reps"
            value={formData.reps}
            onChange={handleChange}
            type="number"
            min="0"
            required
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Sets
          <input
            name="sets"
            value={formData.sets}
            onChange={handleChange}
            type="number"
            min="0"
            required
            className={styles.fieldInput}
          />
        </label>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
      {formSubmitState === 'error' ? (
        <p>There was an issue submitting your log. Please try again.</p>
      ) : (
        <></>
      )}
    </>
  )
}
