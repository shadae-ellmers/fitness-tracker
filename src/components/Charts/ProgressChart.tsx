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
  data: { date: string; percent: number }[]
}

export default function ProgressChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p className={styles.text}>No progress data available yet.</p>
  }

  const overall = data.length > 0 ? data[data.length - 1].percent : 0

  const formatted = (overall > 0 ? '+' : '') + overall.toFixed(1)

  const labels = data.map((d) => d.date)
  const values = data.map((d) => d.percent)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Percentage',
        data: values,
        borderColor: '#222223',
        backgroundColor: 'transparent',
        pointBackgroundColor: '#222223',
        pointRadius: 3,
        fill: false,
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
            const raw = labels[index]

            const date = new Date(raw)

            const d = String(date.getDate()).padStart(2, '0')
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const y = String(date.getFullYear()).slice(-2)

            return `${d}/${m}/${y}`
          },
          maxRotation: 45,
          minRotation: 45,
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
          callback: (value: string | number) => `${value}%`,
          color: '#222223',
        },
      },
    },
  }

  return (
    <div>
      <p className={styles.text}>
        You&apos;ve had a <strong>{formatted}%</strong> change.
      </p>
      <Line data={chartData} options={options} />
    </div>
  )
}
