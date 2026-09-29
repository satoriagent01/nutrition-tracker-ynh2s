/**
 * Nutrition Module - Calculates nutritional values for a given amount of grams.
 */

/**
 * Calculates the nutritional values for a specific number of grams.
 * @param {object} productNutrition - Nutrition data per 100g/ml
 * @param {number} grams - Amount in grams (or ml)
 * @returns {object} Nutrition data scaled to the given grams
 */
export function calculateNutrition(productNutrition, grams) {
  const factor = grams / 100;

  return {
    calories: productNutrition.calories * factor,
    fats: productNutrition.fats * factor,
    saturatedFats: productNutrition.saturatedFats * factor,
    carbohydrates: productNutrition.carbohydrates * factor,
    sugars: productNutrition.sugars * factor,
    fiber: productNutrition.fiber * factor,
    protein: productNutrition.protein * factor,
    sodium: productNutrition.sodium * factor,
  };
}