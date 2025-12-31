'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import PencilIcon from './Icons/PencilIcon'
import styles from './styles/actionButton.module.css'
import { useRouter } from 'next/navigation'
import { updateLog } from '@/app/actions/update'

interface EditButtonProps {
  data: {
    title?: string
    id?: number
    weight?: number
    reps?: number
    sets?: number
  }
  path: string
}

export default function EditButton({ data, path }: EditButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    weight: Number(data.weight),
    reps: Number(data.reps),
    sets: Number(data.sets),
  })

  useEffect(() => {
    setFormData({
      weight: Number(data.weight),
      reps: Number(data.reps),
      sets: Number(data.sets),
    })
  }, [data])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateLog(data.id, formData)
      router.push(path)
      setShowDialog(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    setShowDialog(false)
    setFormData({
      weight: Number(data.weight),
      reps: Number(data.reps),
      sets: Number(data.sets),
    })
  }

  return (
    <>
      <button
        className={styles.deleteButton}
        onClick={() => {
          setShowDialog(true)
        }}
        aria-label={data.title ? `Edit ${data.title}` : 'Edit'}
      >
        <PencilIcon />
      </button>
      {showDialog && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.field}>
                Weight (kg)
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.1"
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
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.cancel}
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
