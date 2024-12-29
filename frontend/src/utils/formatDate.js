import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const formatDateTime = (dateString) => {
    const helsinkiTime = toZonedTime(dateString, 'Europe/Helsinki')
    return format(helsinkiTime, 'dd.MM.yyyy HH:mm')
}

export const formatDate = (dateString) => {
    return format(dateString, 'dd.MM.yyyy')
}