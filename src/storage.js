/**
 * Storage Module - Persists data using localStorage (browser) or memory (Node).
 */

const store = new Map();

/**
 * Saves a value to storage (localStorage in browser, memory in Node).
 * @param {string} key
 * @param {*} value
 */
export function saveToStorage(key, value) {
  const serialized = JSON.stringify(value);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, serialized);
  } else {
    store.set(key, serialized);
  }
}

/**
 * Retrieves a value from storage.
 * @param {string} key
 * @returns {*} The parsed value, or null if not found.
 */
export function getFromStorage(key) {
  let serialized;
  if (typeof localStorage !== "undefined") {
    serialized = localStorage.getItem(key);
  } else {
    serialized = store.get(key);
  }
  if (serialized === null || serialized === undefined) {
    return null;
  }
  return JSON.parse(serialized);
}