'use client'

import styles from './styles/dataCard.module.css'
import DeleteButton from './DeleteButton'
import GoToPageButton from './GoToPageButton'
import EditButton from './EditButton'

type DataCard = {
  id?: number
  secondaryId?: number
  title?: string
  created_at?: string
  weight?: number
  reps?: number
  sets?: number
  exerciseCount?: number
}

type DataCardProps = {
  data: DataCard
  index: number
  type: string
  parentType?: string
  parentId?: number
}

export default function DataCard({
  data,
  index,
  type,
  parentType,
  parentId,
}: DataCardProps) {
  const options = [
    'logItemYellow',
    'logItemPink',
    'logItemGreen',
    'logItemBlue',
  ]

  const colourClass =
    styles[options[index % options.length] as keyof typeof styles]

  const getWord = (count: number | undefined) => {
    if (count === 1) {
      return 'exercise'
    }

    return 'exercises'
  }

  const formattedData = {
    title: data.title,
    id: data.id,
    weight: data.weight,
    reps: data.reps,
    sets: data.sets,
  }

  return (
    <li className={`${styles.logItem} ${colourClass}`}>
      <div className={styles.heading}>
        {type !== 'personalBest' && data.title && (
          <h3 className={styles.logItemName}>{data.title}</h3>
        )}
        {type !== 'workouts' && data.created_at && (
          <h4 className={styles.logItemDate}>{data.created_at}</h4>
        )}
        {type === 'workouts' && data.exerciseCount && (
          <h4 className={styles.logItemDate}>
            {data.exerciseCount} {getWord(data.exerciseCount)}
          </h4>
        )}
      </div>
      {type !== 'exercises' && type !== 'workouts' && data.weight && (
        <div className={styles.logItemStats}>
          <p className={styles.logItemStat}>
            Weight: <span>{data.weight}kg</span>
          </p>
          <p className={styles.logItemStat}>
            Reps: <span>{data.reps}</span>
          </p>
          <p className={styles.logItemStat}>
            Sets: <span>{data.sets}</span>
          </p>
        </div>
      )}
      {data.id &&
        data.title &&
        !parentType &&
        type !== 'workoutExercise' &&
        type !== 'logs' && (
          <div className={styles.buttonWrapper}>
            <DeleteButton
              primaryId={data.id}
              action={type}
              name={data.title}
              path={`/${type}`}
            />
            <GoToPageButton path={`/${type}/${data.id}`} name={data.title} />
          </div>
        )}
      {data.id &&
        data.title &&
        parentType &&
        type !== 'workoutExercise' &&
        type !== 'logs' && (
          <div className={styles.buttonWrapper}>
            <DeleteButton
              primaryId={data.id}
              secondaryId={data.secondaryId}
              action={type}
              name={data.title}
              path={`/${parentType}/${parentId}`}
            />
            <GoToPageButton
              path={`/${parentType}/${data?.id}`}
              name={data.title}
            />
          </div>
        )}
      {data.id && data.title && parentType && type === 'workoutExercise' && (
        <div className={styles.buttonWrapper}>
          <DeleteButton
            primaryId={data.id}
            secondaryId={data.secondaryId}
            action={type}
            name={data.title}
            path={`/${parentType}/${parentId}`}
          />
        </div>
      )}
      {data.id && data.title && type === 'logs' && (
        <div className={styles.buttonWrapper}>
          <DeleteButton
            primaryId={data.id}
            secondaryId={data.secondaryId}
            action={type}
            name={data.title}
            path={`/${type}`}
          />
          <EditButton data={formattedData} path={`/${type}`} />
        </div>
      )}
    </li>
  )
}
