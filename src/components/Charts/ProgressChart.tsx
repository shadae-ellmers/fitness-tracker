'use client'

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import styles from '../styles/charts.module.css'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

interface Props {
  data: { date: string; volume: number; percentChange: number }[]
  dateRange?: string | null
}

export default function ProgressChart({ data, dateRange = null }: Props) {
  if (!data || data.length === 0) {
    return <p className={styles.text}>No progress data available yet.</p>
  }

  const latestPercent = data[data.length - 1].percentChange
  const formatted = (latestPercent > 0 ? '+' : '') + latestPercent.toFixed(1)

  const labels = data.map((d) => d.date)
  const values = data.map((d) => d.volume)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Volume',
        data: values,
        borderColor: '#19160f',
        backgroundColor: 'transparent',
        pointBackgroundColor: '#19160f',
        pointRadius: 3,
        fill: false,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      x: {
        border: {
          color: '#222223',
          width: 2,
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
          text: 'Date',
          color: '#222223',
        },
        ticks: {
          callback: (value: string | number, index: number) => {
            if (index !== 0 && index !== labels.length - 1) {
              return ''
            }

            const raw = labels[index]
            const date = new Date(raw)
            const d = String(date.getDate()).padStart(2, '0')
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const y = String(date.getFullYear()).slice(-2)
            return `${d}/${m}/${y}`
          },
          color: '#222223',
        },
      },
      y: {
        border: {
          color: '#222223',
          width: 2,
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
          text: 'Percentage',
          color: '#222223',
        },
        ticks: {
          callback: (value: string | number) => `${value}`,
          color: '#222223',
        },
      },
    },
  }

  return (
    <div>
      {dateRange === 'month' && (
        <p className={styles.text}>
          You&apos;ve had a <strong>{formatted}%</strong> change in volume over
          the last 30 days.
        </p>
      )}
      {!dateRange && (
        <p className={styles.text}>
          You&apos;ve had a <strong>{formatted}%</strong> change in volume
          overall.
        </p>
      )}
      <Line data={chartData} options={options} />
    </div>
  )
}
