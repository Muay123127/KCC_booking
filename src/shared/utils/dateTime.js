export const getCurrentDateTimeLocal = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const parseDateTime = (dateTime) => {
  if (!dateTime) {
    return { date: '', time: '00:00:00' }
  }

  if (dateTime.includes('T')) {
    const [datePart, timePart] = dateTime.split('T')
    let formattedTime = timePart

    if (timePart.length === 5) {
      formattedTime = `${timePart}:00`
    } else if (!timePart) {
      formattedTime = '00:00:00'
    }

    return { date: datePart, time: formattedTime }
  }

  if (dateTime.includes(' ')) {
    const [datePart, timePart] = dateTime.split(' ')

    if (datePart.includes('/')) {
      const [day, month, year] = datePart.split('/')
      return { date: `${year}-${month}-${day}`, time: timePart || '00:00:00' }
    }

    return { date: datePart, time: timePart || '00:00:00' }
  }

  return { date: dateTime, time: '00:00:00' }
}
