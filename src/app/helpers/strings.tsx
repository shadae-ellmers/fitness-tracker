export function formatDate(date: Date) {
  const formattedDate = new Date(date).toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return formattedDate
}
