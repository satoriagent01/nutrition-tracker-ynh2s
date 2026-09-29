/**
 * Nutrition Module - Calculates nutritional values for a given amount.
 */

/**
 * Parses a serving size string like "100g", "200ml", "50 g" into a numeric value.
 * @param {string} servingSize - e.g. "100g", "200ml"
 * @returns {number} The numeric value (default 100)
 */
function parseServingSize(servingSize) {
  if (!servingSize) return 100;
  const match = servingSize.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 100;
}

/**
 * Calculates the nutritional values for a specific amount.
 * Uses the servingSize/servingUnit from the OCR result to determine the
 * scaling factor. If the product nutrition is per 100g/ml, the factor is
 * grams / servingSizeValue.
 *
 * @param {object} productNutrition - Nutrition data (per serving basis)
 * @param {number} grams - Amount consumed (in grams or ml)
 * @param {object} [options] - Optional
 * @param {string} [options.servingSize] - e.g. "100g" (from OCR)
 * @param {string} [options.servingUnit] - e.g. "g" or "ml" (from OCR)
 * @returns {object} Nutrition data scaled to the given grams
 */
export function calculateNutrition(productNutrition, grams, options = {}) {
  const servingValue = parseServingSize(options.servingSize);
  const factor = grams / servingValue;

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