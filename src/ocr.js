/**
 * OCR Module - Extracts nutritional information from product images using AI.
 * Uses an OpenAI-compatible endpoint configured via environment variables.
 */

const DEFAULT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * Extracts nutritional information from an image.
 * @param {object} imageData - Image data object with { imageData: string } (base64)
 * @returns {Promise<NutritionData>} Promise resolving to extracted nutrition data
 */
export async function extractNutrition(imageData) {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const endpoint = process.env.OPENAI_ENDPOINT || DEFAULT_ENDPOINT;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
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
                url: `data:image/jpeg;base64,${imageData.imageData}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  // Try to extract JSON from the response (handle potential markdown wrapping)
  let jsonStr = content.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  return {
    calories: Number(parsed.calories) || 0,
    fats: Number(parsed.fats) || 0,
    saturatedFats: Number(parsed.saturatedFats) || 0,
    carbohydrates: Number(parsed.carbohydrates) || 0,
    sugars: Number(parsed.sugars) || 0,
    fiber: Number(parsed.fiber) || 0,
    protein: Number(parsed.protein) || 0,
    sodium: Number(parsed.sodium) || 0,
    servingSize: parsed.servingSize || "100g",
    servingUnit: parsed.servingUnit || "g",
  };
}