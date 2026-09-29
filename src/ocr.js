/**
 * OCR Module - Extracts nutritional information from product images using AI.
 * Uses an OpenAI-compatible endpoint. The apiKey is passed by the caller.
 */

const DEFAULT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * Extracts nutritional information from an image.
 * @param {object} imageData - Image data object with { imageData: string } (base64)
 * @param {object} [options] - Optional configuration
 * @param {string} [options.apiKey] - API key for the AI service
 * @param {string} [options.endpoint] - AI endpoint URL
 * @returns {Promise<NutritionData>} Promise resolving to extracted nutrition data
 */
export async function extractNutrition(imageData, options = {}) {
  const apiKey = options.apiKey || "";
  const endpoint = options.endpoint || DEFAULT_ENDPOINT;

  if (!apiKey) {
    throw new Error("API key is required");
  }

  const prompt = `Extract the nutritional information from this product label. Return a JSON object with the following fields based on per 100g (or per 100ml) values:
- calories (number): energy in kcal
- fats (number): total fats in grams
- saturatedFats (number): saturated fats in grams
- carbohydrates (number): total carbohydrates in grams
- sugars (number): sugars in grams
- fiber (number): fiber in grams
- protein (number): protein in grams
- sodium (number): sodium in grams
- servingSize (string): the serving size as shown on the label (e.g., "100g", "200ml")
- servingUnit (string): the unit of the serving size (e.g., "g", "ml")

Return ONLY valid JSON, no markdown, no explanation.`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageData.imageData}`,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "AI API error");
  }

  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}