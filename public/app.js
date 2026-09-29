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
  extractStatus.textContent = "";
});

// --- Extract Nutrition ---
extractBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  if (!file) {
    extractStatus.textContent = "Please select a photo first.";
    extractStatus.style.color = "red";
    return;
  }

  if (!apiKey) {
    extractStatus.textContent = "Please save your API key first.";
    extractStatus.style.color = "red";
    return;
  }

  extractStatus.textContent = "Extracting...";
  extractStatus.style.color = "blue";

  try {
    const base64 = await readFileAsBase64(file);
    const nutritionData = await extractNutrition(
      { imageData: base64 },
      { apiKey }
    );

    productNameInput.value = "Product";
    extractStatus.textContent = "Extraction complete!";
    extractStatus.style.color = "green";
  } catch (err) {
    extractStatus.textContent = `Error: ${err.message}`;
    extractStatus.style.color = "red";
  }
});

// --- Meal Plan ---
createPlanBtn.addEventListener("click", () => {
  const name = mealPlanNameInput.value.trim();
  if (!name) {
    createPlanStatus.textContent = "Please enter a meal plan name.";
    createPlanStatus.style.color = "red";
    return;
  }

  currentMealPlan = createMealPlan(name);
  saveToStorage("current-meal-plan", currentMealPlan);
  createPlanStatus.textContent = `Meal plan "${name}" created!`;
  createPlanStatus.style.color = "green";
  updateMealPlanDisplay();
});

// --- Add Product ---
addProductBtn.addEventListener("click", () => {
  if (!currentMealPlan) {
    addProductStatus.textContent = "Please create a meal plan first.";
    addProductStatus.style.color = "red";
    return;
  }

  const grams = parseFloat(productGramsInput.value);
  if (isNaN(grams) || grams <= 0) {
    addProductStatus.textContent = "Please enter a valid amount.";
    addProductStatus.style.color = "red";
    return;
  }

  // Use mock nutrition data for now (in real app, this would come from OCR)
  const productNutrition = {
    calories: 549,
    fats: 33,
    saturatedFats: 13,
    carbohydrates: 55,
    sugars: 45,
    fiber: 2.4,
    protein: 6.8,
    sodium: 0.18,
    servingSize: "100g",
    servingUnit: "g",
  };

  currentMealPlan = addProductToMealPlan(
    currentMealPlan,
    "product-1",
    grams,
    productNutrition
  );

  saveToStorage("current-meal-plan", currentMealPlan);
  addProductStatus.textContent = `Added ${grams}g to meal plan!`;
  addProductStatus.style.color = "green";
  updateMealPlanDisplay();
});

// --- Display ---
function updateMealPlanDisplay() {
  if (!currentMealPlan) {
    mealPlanList.innerHTML = "<p>No meal plan created yet.</p>";
    mealPlanTotals.innerHTML = "";
    return;
  }

  const total = getMealPlanTotal(currentMealPlan);

  mealPlanList.innerHTML = `
    <h3>${currentMealPlan.name}</h3>
    <ul>
      ${currentMealPlan.items
        .map(
          (item) =>
            `<li>${item.grams}g - ${item.nutrition.calories.toFixed(1)} kcal</li>`
        )
        .join("")}
    </ul>
  `;

  mealPlanTotals.innerHTML = `
    <h3>Total Nutrition</h3>
    <p>Calories: ${total.calories.toFixed(1)} kcal</p>
    <p>Fats: ${total.fats.toFixed(1)}g</p>
    <p>Carbohydrates: ${total.carbohydrates.toFixed(1)}g</p>
    <p>Protein: ${total.protein.toFixed(1)}g</p>
  `;
}

// --- Helpers ---
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Navigation ---
document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    document.getElementById(target).classList.add("active");
  });
});

// --- Init ---
const savedPlan = getFromStorage("current-meal-plan");
if (savedPlan) {
  currentMealPlan = savedPlan;
  updateMealPlanDisplay();
}