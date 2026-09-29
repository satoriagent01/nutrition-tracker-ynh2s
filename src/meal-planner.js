/**
 * Meal Planner Module - Creates and manages meal plans.
 */

import { calculateNutrition } from "./nutrition.js";

/**
 * Generates a simple unique ID.
 */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Creates a new meal plan.
 * @param {string} name - Name of the meal plan
 * @returns {object} Meal plan object with id, name, items, and createdAt
 */
export function createMealPlan(name) {
  return {
    id: generateId(),
    name: name,
    items: [],
    createdAt: new Date(),
  };
}

/**
 * Adds a product to a meal plan.
 * @param {object} mealPlan - The meal plan object
 * @param {string} productId - Product identifier
 * @param {number} grams - Amount in grams
 * @returns {object} Updated meal plan
 */
export function addProductToMealPlan(mealPlan, productId, grams) {
  // We need product nutrition data to calculate the nutrition for the given grams.
  // The product nutrition is expected to be stored in a products map or similar.
  // For now, we store the productId and grams, and the nutrition will be calculated
  // when getting the total.
  
  const updatedPlan = {
    ...mealPlan,
    items: [...mealPlan.items, { productId, grams }],
  };

  return updatedPlan;
}

/**
 * Gets the total nutritional values for a meal plan.
 * @param {object} mealPlan - The meal plan object
 * @param {object} [productsMap] - Optional map of productId to product nutrition data
 * @returns {object} Total nutritional values
 */
export function getMealPlanTotal(mealPlan, productsMap) {
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

  if (!productsMap) {
    return total;
  }

  for (const item of mealPlan.items) {
    const productNutrition = productsMap[item.productId];
    if (productNutrition) {
      const itemNutrition = calculateNutrition(productNutrition, item.grams);
      total.calories += itemNutrition.calories;
      total.fats += itemNutrition.fats;
      total.saturatedFats += itemNutrition.saturatedFats;
      total.carbohydrates += itemNutrition.carbohydrates;
      total.sugars += itemNutrition.sugars;
      total.fiber += itemNutrition.fiber;
      total.protein += itemNutrition.protein;
      total.sodium += itemNutrition.sodium;
    }
  }

  return total;
}