'use client'

import Link from 'next/link'
import ChevronLeftIcon from './Icons/ChevronLeftIcon'
import styles from './styles/backLink.module.css'

interface BackLinkProps {
  link: string
}

export default function BackLink({ link }: BackLinkProps) {
  return (
    <Link href={link} className={styles.backLink}>
      <span className={styles.backIcon}>
        <ChevronLeftIcon />
      </span>
      <div className={styles.backText}>Back</div>
    </Link>
  )
}
