'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './styles/addForm.module.css'
import { addExercise } from '@/app/actions/create'
import { useRouter } from 'next/navigation'

interface AddExerciseProps {
  userId: string
}

export default function AddExerciseForm({ userId }: AddExerciseProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
  })

  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await addExercise({
        userId: userId,
        name: formData.name,
      })

      router.push('/exercises?status=success')
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
            onChange={handleChange}
            required
            className={styles.fieldInput}
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
