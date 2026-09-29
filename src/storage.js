export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key) {
  const val = localStorage.getItem(key);
  return val !== null ? JSON.parse(val) : null;
}