import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveToStorage, getFromStorage } from "../src/storage.js";

describe("Storage Module", () => {
  test("AC-4: saveToStorage and getFromStorage persist data", () => {
    const key = "test-key";
    const value = { name: "Mi Plan", items: [] };

    saveToStorage(key, value);
    const retrieved = getFromStorage(key);

    assert.deepStrictEqual(retrieved, value);
  });

  test("AC-4: getFromStorage returns null for non-existent key", () => {
    const retrieved = getFromStorage("non-existent-key");
    assert.strictEqual(retrieved, null);
  });

  test("AC-4: saveToStorage overwrites existing value", () => {
    const key = "overwrite-test";
    const value1 = { value: 1 };
    const value2 = { value: 2 };

    saveToStorage(key, value1);
    assert.deepStrictEqual(getFromStorage(key), value1);

    saveToStorage(key, value2);
    assert.deepStrictEqual(getFromStorage(key), value2);
  });

  test("AC-4: saveToStorage handles different data types", () => {
    saveToStorage("string-key", "hello");
    assert.strictEqual(getFromStorage("string-key"), "hello");

    saveToStorage("number-key", 42);
    assert.strictEqual(getFromStorage("number-key"), 42);

    saveToStorage("boolean-key", true);
    assert.strictEqual(getFromStorage("boolean-key"), true);

    saveToStorage("array-key", [1, 2, 3]);
    assert.deepStrictEqual(getFromStorage("array-key"), [1, 2, 3]);

    saveToStorage("object-key", { a: 1, b: 2 });
    assert.deepStrictEqual(getFromStorage("object-key"), { a: 1, b: 2 });
  });
});