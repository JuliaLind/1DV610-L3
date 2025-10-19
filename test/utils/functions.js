/**
 * Calculates the average of an array of values.
 *
 * @param {Array<number>} values - the values to average
 * @returns {number} The average value.
 */
export const calculateAverage = (values) => {
  const sum = values.reduce((acc, val) => acc + val, 0)
  const average = sum / values.length
  const inverted = 1 / average
  return Number(inverted.toFixed(4))
}

/**
 * Rounds a number to specified decimals.
 *
 * @param {number} amount - the amount to round
 * @param {number} decimals - the number of decimals to keep
 * @returns {number} - the rounded amount
 */
export const round = (amount, decimals = 4) => {
  return Number(amount.toFixed(decimals))
}
