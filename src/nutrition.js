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
  const servingSizeStr = productNutrition?.servingSize || "100g";
  const servingValue = parseFloat(servingSizeStr);
  const factor = grams / (isNaN(servingValue) ? 100 : servingValue);

  return {
    calories: (productNutrition.calories || 0) * factor,
    fats: (productNutrition.fats || 0) * factor,
    saturatedFats: (productNutrition.saturatedFats || 0) * factor,
    carbohydrates: (productNutrition.carbohydrates || 0) * factor,
    sugars: (productNutrition.sugars || 0) * factor,
    fiber: (productNutrition.fiber || 0) * factor,
    protein: (productNutrition.protein || 0) * factor,
    sodium: (productNutrition.sodium || 0) * factor,
  };
}