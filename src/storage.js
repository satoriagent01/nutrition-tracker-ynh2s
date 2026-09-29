const store = new Map();

export function saveToStorage(key, value) {
  store.set(key, JSON.parse(JSON.stringify(value)));
}

export function getFromStorage(key) {
  const val = store.get(key);
  return val !== undefined ? JSON.parse(JSON.stringify(val)) : null;
}