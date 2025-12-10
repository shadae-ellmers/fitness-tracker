'use client'

import { useRouter } from 'next/navigation'
import ArrowRightIcon from './Icons/ArrowRightIcon'
import styles from './styles/actionButton.module.css'

type GoToPageButtonProps = {
  path: string
}

export default function GoToPageButton({ path }: GoToPageButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(path)
  }

  return (
    <button className={styles.pageButton} onClick={handleClick}>
      <ArrowRightIcon />
    </button>
  )
}
