/**
 * Storage Module - Persistence using localStorage.
 */

/**
 * Saves a value to localStorage.
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 */
export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from localStorage.
 * @param {string} key - Storage key
 * @returns {*} The stored value, or null if not found
 */
export function getFromStorage(key) {
  const value = localStorage.getItem(key);
  if (value === null) {
    return null;
  }
  return JSON.parse(value);
}