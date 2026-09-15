const localDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?$/

export function parseServerDateTime(value: string) {
  const match = localDateTimePattern.exec(value)

  if (!match) {
    return new Date(value)
  }

  const [, year, month, day, hours, minutes, seconds = '0', fraction = '0'] = match
  const milliseconds = Number(fraction.padEnd(3, '0').slice(0, 3))

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
    milliseconds,
  )
}
