import styles from './styles/charts.module.css'

interface HeatmapProps {
  data: { date: string | null; count: number | null }[]
}

export default function Heatmap({ data }: HeatmapProps) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Break into weeks (columns)
  const weeks: (typeof data)[] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const getColor = (count: number | null) => {
    if (count === null) return '#222223'
    if (count === 0) return '#222223'
    if (count === 1) return '#4caf50'
    if (count < 4) return '#3D8942'
    return '#306B34'
  }

  const todayKey = new Date().toLocaleDateString('en-NZ')

  return (
    <div className={styles.container}>
      {/* Weekday labels */}
      <div className={styles.weekdayLabels}>
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className={styles.heatmap}>
        <div className={styles.grid}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className={styles.column}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`${styles.square} 
                    ${day.date === null ? styles.disabled : ''} 
                    ${day.date === todayKey ? styles.today : ''}`}
                  style={{ backgroundColor: getColor(day.count) }}
                  title={
                    day.date
                      ? `${day.date}: ${day.count} workouts`
                      : 'Future day'
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
