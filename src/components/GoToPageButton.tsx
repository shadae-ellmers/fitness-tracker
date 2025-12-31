'use client'

import { useRouter } from 'next/navigation'
import ArrowRightIcon from './Icons/ArrowRightIcon'
import styles from './styles/actionButton.module.css'

interface GoToPageButtonProps {
  path: string
  name: string
}

export default function GoToPageButton({ path, name }: GoToPageButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(path)
  }

  return (
    <button
      className={styles.pageButton}
      onClick={handleClick}
      aria-label={`Go to ${name} page`}
    >
      <ArrowRightIcon />
    </button>
  )
}
