'use client'

import { useState } from 'react'
import HamburgerIcon from './Icons/HamburgerIcon'
import styles from './styles/navigation.module.css'
import CloseIcon from './Icons/CloseIcon'
import BellIcon from './Icons/BellIcon'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const [navDisplay, setNavDisplay] = useState(false)
  const router = useRouter()

  const toggleNav = () => {
    setNavDisplay(!navDisplay)
  }

  const links = [
    { label: 'Dashboard', path: '/' },
    { label: 'Exercises', path: '/exercises' },
    { label: 'Workouts', path: '/workouts' },
    { label: 'Logs', path: '/logs' },
  ]

  const goToPage = (path: string) => {
    const route = `/${path}`
    router.push(route)
    setNavDisplay(false)
  }

  return (
    <>
      <nav className={`${styles.nav} ${!navDisplay ? styles.closed : ''}`}>
        <div className={styles.navContent}>
          <div className={styles.navButtons}>
            <button
              className={styles.bellIcon}
              aria-label="Go to notifications"
              onClick={() => goToPage('notifications')}
            >
              <BellIcon />
            </button>
            <button
              className={styles.closeIcon}
              onClick={toggleNav}
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </button>
          </div>

          <ul className={styles.links}>
            {links.map((link, index) => (
              <li key={index} className={styles.linkWrapper}>
                <Link
                  href={link.path}
                  className={styles.linkItem}
                  onClick={() => setNavDisplay(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {!navDisplay && (
        <button
          className={styles.navIcon}
          onClick={toggleNav}
          aria-label="Open navigation menu"
        >
          <HamburgerIcon />
        </button>
      )}
    </>
  )
}
