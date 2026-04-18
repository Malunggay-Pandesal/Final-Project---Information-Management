/**
 * Format a number as USD currency.
 * @param {number|string} value
 */
export function formatCurrency(value) {
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num)
}

/**
 * Format a date string or Date object as "MMM D, YYYY".
 * @param {string|Date} value
 */
export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d)) return String(value)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Truncate a string to maxLen characters.
 */
export function truncate(str, maxLen = 30) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

/**
 * Generate a next transaction number from the highest existing one.
 * E.g. "TR000124" → "TR000125"
 */
export function nextTransNo(latestTransNo) {
  if (!latestTransNo) return 'TR000001'
  const num = parseInt(latestTransNo.replace('TR', ''), 10)
  return 'TR' + String(num + 1).padStart(6, '0')
}
