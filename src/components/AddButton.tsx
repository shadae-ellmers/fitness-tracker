'use client'

import { useRouter } from 'next/navigation'
import PlusIcon from './Icons/PlusIcon'
import styles from './styles/actionButton.module.css'

interface AddButtonProps {
  path: string
  ariaLabel: string
}

export default function AddButton({ path, ariaLabel }: AddButtonProps) {
  const router = useRouter()

  const add = () => {
    const route = `/${path}/add`
    router.push(route)
  }

  return (
    <button className={styles.addButton} onClick={add} aria-label={ariaLabel}>
      <PlusIcon />
    </button>
  )
}
