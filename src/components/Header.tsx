'use client'

import { useUser } from '@auth0/nextjs-auth0'
import styles from './styles/header.module.css'
import Navigation from './Navigation'

export default function Header() {
  const { user } = useUser()

  const getGreeting = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 12) {
      return 'Mōrena'
    } else if (hour > 12 && hour < 17) {
      return 'Ahiahi mārie'
    } else {
      return 'Pōmārie'
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.userContainer}>
        <div className={styles.profilePhotoContainer}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={
                user.name
                  ? `Profile picture for ${user.name}`
                  : 'Profile picture'
              }
            />
          ) : (
            <div className={styles.profilePhotoEmpty} aria-hidden="true"></div>
          )}
        </div>
        <div className={styles.userGreeting}>
          <h1 className={styles.greeting}>{getGreeting()}</h1>
          {user?.name ? (
            <h2 className={styles.userName}>{user.name.split(' ')[0]}</h2>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Navigation />
    </header>
  )
}
