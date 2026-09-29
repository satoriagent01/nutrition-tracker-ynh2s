/**
 * Nutrition Tracker - Frontend Application
 */

import { extractNutrition } from "../src/ocr.js";
import { calculateNutrition } from "../src/nutrition.js";
import { createMealPlan, addProductToMealPlan, getMealPlanTotal } from "../src/meal-planner.js";
import { saveToStorage, getFromStorage } from "../src/storage.js";

// --- State ---
let currentMealPlan = null;
let apiKey = localStorage.getItem("nutrition-api-key") || "";

// --- DOM Elements ---
const apiKeyInput = document.getElementById("api-key-input");
const apiKeySaveBtn = document.getElementById("api-key-save");
const apiKeyStatus = document.getElementById("api-key-status");

const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");
const extractBtn = document.getElementById("extract-btn");
const extractStatus = document.getElementById("extract-status");

const productNameInput = document.getElementById("product-name");
const productGramsInput = document.getElementById("product-grams");
const addProductBtn = document.getElementById("add-product-btn");
const addProductStatus = document.getElementById("add-product-status");

const mealPlanNameInput = document.getElementById("meal-plan-name");
const createPlanBtn = document.getElementById("create-plan-btn");
const createPlanStatus = document.getElementById("create-plan-status");

const mealPlanList = document.getElementById("meal-plan-list");
const mealPlanTotals = document.getElementById("meal-plan-totals");

// --- API Key ---
apiKeyInput.value = apiKey;

apiKeySaveBtn.addEventListener("click", () => {
  apiKey = apiKeyInput.value.trim();
  localStorage.setItem("nutrition-api-key", apiKey);
  apiKeyStatus.textContent = "API key saved!";
  apiKeyStatus.style.color = "green";
  setTimeout(() => { apiKeyStatus.textContent = ""; }, 2000);
});

// --- Photo Upload ---
photoInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  photoPreview.src = URL.createObjectURL(file);
  photoPreview.style.display = "block";
  extractBtn.disabled = false;
  extractStatus.textContent = "";
});

extractBtn.addEventListener("click", async () => {
  if (!apiKey) {
    extractStatus.textContent = "Please set your API key first.";
    extractStatus.style.color = "red";
    return;
  }

  const file = photoInput.files[0];
  if (!file) {
    extractStatus.textContent = "Please select a photo first.";
    extractStatus.style.color = "red";
    return;
  }

  extractStatus.textContent = "Extracting nutrition info...";
  extractStatus.style.color = "blue";
  extractBtn.disabled = true;

  try {
    const base64 = await readFileAsBase64(file);
    const nutritionData = await extractNutrition({ imageData: base64 }, apiKey);

    productNameInput.value = "Scanned Product";
    productGramsInput.value = "100";

    // Store the OCR result for use when adding to meal plan
    window.lastExtractedNutrition = nutritionData;

    extractStatus.textContent = `Extracted: ${nutritionData.calories} kcal per ${nutritionData.servingSize || "serving"}`;
    extractStatus.style.color = "green";
  } catch (err) {
    extractStatus.textContent = `Error: ${err.message}`;
    extractStatus.style.color = "red";
  } finally {
    extractBtn.disabled = false;
  }
});

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove data URL prefix
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Meal Plan ---
createPlanBtn.addEventListener("click", () => {
  const name = mealPlanNameInput.value.trim() || "My Meal Plan";
  currentMealPlan = createMealPlan(name);
  saveToStorage("current-meal-plan", currentMealPlan);
  renderMealPlan();
  createPlanStatus.textContent = `Meal plan "${name}" created!`;
  createPlanStatus.style.color = "green";
  setTimeout(() => { createPlanStatus.textContent = ""; }, 2000);
});

addProductBtn.addEventListener("click", () => {
  if (!currentMealPlan) {
    addProductStatus.textContent = "Please create a meal plan first.";
    addProductStatus.style.color = "red";
    return;
  }

  const productId = "product-" + Date.now();
  const grams = parseFloat(productGramsInput.value) || 100;

  // Use the last extracted nutrition data, or default to 100g values
  let productNutrition = window.lastExtractedNutrition || {
    calories: 200,
    fats: 10,
    saturatedFats: 2,
    carbohydrates: 25,
    sugars: 10,
    fiber: 1,
    protein: 5,
    sodium: 0.1,
    servingSize: "100g",
    servingUnit: "g",
  };

  // Use servingSize for scaling if available
  const servingValue = parseServingSize(productNutrition.servingSize);
  const factor = grams / servingValue;

  const nutrition = {
    calories: productNutrition.calories * factor,
    fats: productNutrition.fats * factor,
    saturatedFats: productNutrition.saturatedFats * factor,
    carbohydrates: productNutrition.carbohydrates * factor,
    sugars: productNutrition.sugars * factor,
    fiber: productNutrition.fiber * factor,
    protein: productNutrition.protein * factor,
    sodium: productNutrition.sodium * factor,
  };

  currentMealPlan = addProductToMealPlan(currentMealPlan, productId, grams, productNutrition);
  saveToStorage("current-meal-plan", currentMealPlan);
  renderMealPlan();
  addProductStatus.textContent = `Added ${grams}g to meal plan!`;
  addProductStatus.style.color = "green";
  setTimeout(() => { addProductStatus.textContent = ""; }, 2000);
});

function parseServingSize(servingSize) {
  if (!servingSize) return 100;
  const match = servingSize.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 100;
}

function renderMealPlan() {
  if (!currentMealPlan) {
    mealPlanList.innerHTML = "<p>No meal plan created yet.</p>";
    mealPlanTotals.innerHTML = "";
    return;
  }

  let html = `<h3>${currentMealPlan.name}</h3>`;
  html += "<ul>";
  for (const item of currentMealPlan.items) {
    html += `<li>${item.grams}g - ${item.nutrition.calories.toFixed(1)} kcal</li>`;
  }
  html += "</ul>";
  mealPlanList.innerHTML = html;

  const total = getMealPlanTotal(currentMealPlan);
  mealPlanTotals.innerHTML = `
    <h3>Total Nutrition</h3>
    <p>Calories: ${total.calories.toFixed(1)} kcal</p>
    <p>Fats: ${total.fats.toFixed(1)}g</p>
    <p>Protein: ${total.protein.toFixed(1)}g</p>
    <p>Carbohydrates: ${total.carbohydrates.toFixed(1)}g</p>
    <p>Sugars: ${total.sugars.toFixed(1)}g</p>
    <p>Fiber: ${total.fiber.toFixed(1)}g</p>
  `;
}

// Load saved meal plan on startup
const savedPlan = getFromStorage("current-meal-plan");
if (savedPlan) {
  currentMealPlan = savedPlan;
  renderMealPlan();
}