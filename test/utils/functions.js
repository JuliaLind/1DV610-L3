/**
 * Calculates the average of an array of values.
 *
 * @param {Array<number>} values - the values to average
 * @returns {number} The average value.
 */
export const calculateAverage = (values) => {
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Number((sum / values.length).toFixed(4))
}
