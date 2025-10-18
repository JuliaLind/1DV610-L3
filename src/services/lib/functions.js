/**
 * Splits a string into an array at the given delimiter.
 *
 * @param {string} str - the string to split
 * @param {string} delimiter - the delimeter to split the string at
 * @returns {Array} The array of strings
 */
export function stringToArray (str, delimiter = '+') {
  if (!str) return []
  return str.split(delimiter)
}
