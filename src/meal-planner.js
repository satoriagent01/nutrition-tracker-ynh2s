import { calculateNutrition } from "./nutrition.js";

/**
 * Creates a new meal plan.
 * @param {string} name - The name of the meal plan.
 * @returns {{ id: string, name: string, items: Array, createdAt: Date }}
 */
export function createMealPlan(name) {
  return {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: new Date(),
  };
}

/**
 * Adds a product to a meal plan.
 * @param {{ id: string, name: string, items: Array, createdAt: Date }} mealPlan
 * @param {string} productId
 * @param {number} grams
 * @param {object} productNutrition - Nutrition data per 100g/ml from OCR
 * @returns {{ id: string, name: string, items: Array, createdAt: Date }}
 */
export function addProductToMealPlan(mealPlan, productId, grams, productNutrition) {
  const nutrition = calculateNutrition(productNutrition, grams);

  return {
    ...mealPlan,
    items: [
      ...mealPlan.items,
      {
        productId,
        grams,
        nutrition,
      },
    ],
  };
}

/**
 * Gets the total nutrition for a meal plan.
 * @param {{ id: string, name: string, items: Array, createdAt: Date }} mealPlan
 * @returns {{ calories: number, fats: number, saturatedFats: number, carbohydrates: number, sugars: number, fiber: number, protein: number, sodium: number }}
 */
export function getMealPlanTotal(mealPlan) {
  const total = {
    calories: 0,
    fats: 0,
    saturatedFats: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
  };

  for (const item of mealPlan.items) {
    total.calories += item.nutrition.calories;
    total.fats += item.nutrition.fats;
    total.saturatedFats += item.nutrition.saturatedFats;
    total.carbohydrates += item.nutrition.carbohydrates;
    total.sugars += item.nutrition.sugars;
    total.fiber += item.nutrition.fiber;
    total.protein += item.nutrition.protein;
    total.sodium += item.nutrition.sodium;
  }

  return total;
}