'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import styles from './search.module.css'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={styles.search}>
      <label htmlFor="search" className={styles.srOnly}>
        Search
      </label>
      <input
        className={styles.searchInput}
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  )
}
