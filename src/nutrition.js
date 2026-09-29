/**
 * Nutrition Module - Calculates nutritional values for a given amount of grams.
 */

/**
 * Calculates the nutritional values for a specific amount based on the serving size.
 * @param {object} productNutrition - Nutrition data with servingSize and servingUnit
 * @param {number} grams - Amount in grams (or ml)
 * @returns {object} Nutrition data scaled to the given grams
 */
export function calculateNutrition(productNutrition, grams) {
  // Parse the serving size value (e.g., "100g" -> 100, "200ml" -> 200)
  const servingSizeStr = productNutrition.servingSize || "100g";
  const servingValue = parseFloat(servingSizeStr);
  const factor = grams / (isNaN(servingValue) ? 100 : servingValue);

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