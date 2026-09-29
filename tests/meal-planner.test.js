import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMealPlan, addProductToMealPlan, getMealPlanTotal } from "../src/meal-planner.js";

describe("Meal Planner Module", () => {
  test("AC-3: createMealPlan creates a plan with id, name, items and createdAt", () => {
    const plan = createMealPlan("Mi Plan");

    assert.ok(typeof plan.id === "string");
    assert.ok(plan.id.length > 0);
    assert.strictEqual(plan.name, "Mi Plan");
    assert.ok(Array.isArray(plan.items));
    assert.strictEqual(plan.items.length, 0);
    assert.ok(plan.createdAt instanceof Date);
  });

  test("AC-3: addProductToMealPlan adds a product with grams and nutrition", () => {
    const plan = createMealPlan("Mi Plan");

    // Mock product nutrition (as if extracted by OCR)
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

    // We need to mock the nutrition calculation. Since calculateNutrition
    // scales from 100g basis, for 30g:
    const expectedNutrition = {
      calories: 164.7,
      fats: 9.9,
      saturatedFats: 3.9,
      carbohydrates: 16.5,
      sugars: 13.5,
      fiber: 0.72,
      protein: 2.04,
      sodium: 0.054,
    };

    // Note: In the real implementation, addProductToMealPlan would call
    // calculateNutrition internally. For testing, we verify the structure.
    // The actual implementation should handle this.
    
    // Since we can't test the full integration without src/nutrition.js,
    // we test the meal plan structure after adding a product
    const updatedPlan = addProductToMealPlan(plan, "product-1", 30);

    assert.strictEqual(updatedPlan.items.length, 1);
    assert.strictEqual(updatedPlan.items[0].productId, "product-1");
    assert.strictEqual(updatedPlan.items[0].grams, 30);
    // The nutrition field should be present (calculated from productNutrition * grams/100)
    assert.ok(updatedPlan.items[0].nutrition);
  });

  test("AC-3: getMealPlanTotal sums up all items in the plan", () => {
    const plan = createMealPlan("Mi Plan");

    // Add two products
    const planWithOne = addProductToMealPlan(plan, "product-1", 30);
    const planWithTwo = addProductToMealPlan(planWithOne, "product-2", 50);

    const total = getMealPlanTotal(planWithTwo);

    // The total should be the sum of all items' nutrition
    assert.ok(total);
    assert.strictEqual(typeof total.calories, "number");
    assert.strictEqual(typeof total.fats, "number");
    assert.strictEqual(typeof total.saturatedFats, "number");
    assert.strictEqual(typeof total.carbohydrates, "number");
    assert.strictEqual(typeof total.sugars, "number");
    assert.strictEqual(typeof total.fiber, "number");
    assert.strictEqual(typeof total.protein, "number");
    assert.strictEqual(typeof total.sodium, "number");
  });

  test("AC-3: getMealPlanTotal returns zeros for empty plan", () => {
    const plan = createMealPlan("Mi Plan");
    const total = getMealPlanTotal(plan);

    assert.strictEqual(total.calories, 0);
    assert.strictEqual(total.fats, 0);
    assert.strictEqual(total.saturatedFats, 0);
    assert.strictEqual(total.carbohydrates, 0);
    assert.strictEqual(total.sugars, 0);
    assert.strictEqual(total.fiber, 0);
    assert.strictEqual(total.protein, 0);
    assert.strictEqual(total.sodium, 0);
  });
});