import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateNutrition } from "../src/nutrition.js";

describe("Nutrition Module", () => {
  test("AC-3: calculateNutrition scales values from 100g to specified grams", () => {
    // Example from spec: Dr. Schär bar, 100g values
    const productNutrition = {
      calories: 549,
      fats: 33,
      saturatedFats: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      sodium: 0.18,
    };

    // For 30g (one serving)
    const result = calculateNutrition(productNutrition, 30);

    // Expected: 30/100 = 0.3 multiplier
    assert.strictEqual(result.calories, 164.7);
    assert.strictEqual(result.fats, 9.9);
    assert.strictEqual(result.saturatedFats, 3.9);
    assert.strictEqual(result.carbohydrates, 16.5);
    assert.strictEqual(result.sugars, 13.5);
    assert.strictEqual(result.fiber, 0.72);
    assert.strictEqual(result.protein, 2.04);
    assert.strictEqual(result.sodium, 0.054);
  });

  test("AC-3: calculateNutrition works with 100g (no scaling)", () => {
    const productNutrition = {
      calories: 549,
      fats: 33,
      saturatedFats: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      sodium: 0.18,
    };

    const result = calculateNutrition(productNutrition, 100);

    assert.strictEqual(result.calories, 549);
    assert.strictEqual(result.fats, 33);
    assert.strictEqual(result.saturatedFats, 13);
    assert.strictEqual(result.carbohydrates, 55);
    assert.strictEqual(result.sugars, 45);
    assert.strictEqual(result.fiber, 2.4);
    assert.strictEqual(result.protein, 6.8);
    assert.strictEqual(result.sodium, 0.18);
  });

  test("AC-3: calculateNutrition works with 0g", () => {
    const productNutrition = {
      calories: 549,
      fats: 33,
      saturatedFats: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      sodium: 0.18,
    };

    const result = calculateNutrition(productNutrition, 0);

    assert.strictEqual(result.calories, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbohydrates, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.sodium, 0);
  });

  test("AC-3: calculateNutrition works with juice example (100ml basis)", () => {
    // Juice: 199 kJ / 47 kcal per 100ml
    const productNutrition = {
      calories: 47,
      fats: 0,
      saturatedFats: 0,
      carbohydrates: 11,
      sugars: 10,
      fiber: 0,
      protein: 0.7,
      sodium: 0.4,
    };

    // For 200ml (one glass)
    const result = calculateNutrition(productNutrition, 200);

    assert.strictEqual(result.calories, 94);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbohydrates, 22);
    assert.strictEqual(result.sugars, 20);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 1.4);
    assert.strictEqual(result.sodium, 0.8);
  });
});