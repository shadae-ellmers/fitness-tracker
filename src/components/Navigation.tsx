'use client'

import { useEffect, useRef, useState } from 'react'
import HamburgerIcon from './Icons/HamburgerIcon'
import styles from './styles/navigation.module.css'
import CloseIcon from './Icons/CloseIcon'
import Link from 'next/link'

export default function Navigation() {
  const [navDisplay, setNavDisplay] = useState(false)

  const openButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (navDisplay) {
      closeButtonRef.current?.focus()
    } else {
      openButtonRef.current?.focus()
    }
  }, [navDisplay])

  const toggleNav = () => {
    setNavDisplay(!navDisplay)
  }

  const links = [
    { label: 'Dashboard', path: '/' },
    { label: 'Exercises', path: '/exercises' },
    { label: 'Workouts', path: '/workouts' },
    { label: 'Logs', path: '/logs' },
  ]

  return (
    <>
      <nav
        className={`${styles.nav} ${!navDisplay ? styles.closed : ''}`}
        aria-hidden={!navDisplay}
      >
        <div className={styles.navContent}>
          <div className={styles.navButtons}>
            <button
              ref={closeButtonRef}
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
                  onClick={() => {
                    setNavDisplay(false)
                  }}
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
          ref={openButtonRef}
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
