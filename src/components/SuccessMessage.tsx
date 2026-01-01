'use client'

import { useRouter } from 'next/navigation'
import CloseIcon from './Icons/CloseIcon'
import styles from './styles/successMessage.module.css'

interface SuccessMessageProps {
  name: string
  path: string
}

export default function SuccessMessage({ name, path }: SuccessMessageProps) {
  const router = useRouter()

  const handleHide = () => {
    router.push(`/${path}`)
  }

  const handleCapitalName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className={styles.successMessage}>
      <h3 className={styles.successText}>
        {handleCapitalName(name)} successfully created
      </h3>
      <button
        type="button"
        className={styles.closeIcon}
        aria-label="Cancel"
        onClick={handleHide}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
