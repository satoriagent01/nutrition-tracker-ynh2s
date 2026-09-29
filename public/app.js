/**
 * Client-side application for the Nutrition Tracker.
 * Uses browser APIs (localStorage, fetch, FileReader) - runs in the browser.
 */

import { saveToStorage, getFromStorage } from '../src/storage.js';
import { calculateNutrition } from '../src/nutrition.js';
import { createMealPlan, addProductToMealPlan, getMealPlanTotal } from '../src/meal-planner.js';
import { extractNutrition } from '../src/ocr.js';

// State
let currentScanResult = null;
let activePlanId = null;

// Navigation
document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});

// Load config from localStorage
const savedConfig = getFromStorage('nutrition-tracker-config');
if (savedConfig) {
  document.getElementById('aiUrl').value = savedConfig.aiUrl || '';
  document.getElementById('apiKey').value = savedConfig.apiKey || '';
}

// Save config
document.getElementById('saveConfigBtn').addEventListener('click', () => {
  const config = {
    aiUrl: document.getElementById('aiUrl').value,
    apiKey: document.getElementById('apiKey').value,
  };
  saveToStorage('nutrition-tracker-config', config);
  const status = document.getElementById('configStatus');
  status.innerHTML = '<div class="success">Configuración guardada correctamente.</div>';
  setTimeout(() => status.innerHTML = '', 3000);
});

// Scan functionality
document.getElementById('scanBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('imageInput');
  if (!fileInput.files.length) {
    alert('Por favor selecciona una imagen.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const base64Data = e.target.result;

    try {
      const result = await extractNutrition({ imageData: base64Data });
      currentScanResult = result;

      document.getElementById('scanResultCard').style.display = 'block';
      const content = document.getElementById('scanResultContent');
      content.innerHTML = `
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="value">${result.calories}</div>
            <div class="label">Calorías (kcal)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.fats}</div>
            <div class="label">Grasas (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.saturatedFats}</div>
            <div class="label">Grasas saturadas (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.carbohydrates}</div>
            <div class="label">Carbohidratos (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.sugars}</div>
            <div class="label">Azúcares (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.fiber}</div>
            <div class="label">Fibra (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.protein}</div>
            <div class="label">Proteínas (g)</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${result.sodium}</div>
            <div class="label">Sodio (g)</div>
          </div>
        </div>
        <p style="margin-top: 1rem; color: #666;">Tamaño de porción: ${result.servingSize} ${result.servingUnit}</p>
      `;
    } catch (err) {
      document.getElementById('scanResult').innerHTML = `<div class="error">Error al escanear: ${err.message}</div>`;
    }
  };

  reader.readAsDataURL(file);
});

// Add from scan to active plan
document.getElementById('addFromScan').addEventListener('click', () => {
  if (!currentScanResult) return;

  const grams = parseFloat(document.getElementById('scanGrams').value) || 100;
  const scaled = calculateNutrition(currentScanResult, grams);

  if (activePlanId) {
    const plans = getFromStorage('nutrition-tracker-plans') || [];
    const planIndex = plans.findIndex(p => p.id === activePlanId);
    if (planIndex !== -1) {
      const updatedPlan = addProductToMealPlan(plans[planIndex], 'scanned-product', grams);
      updatedPlan.items[updatedPlan.items.length - 1].nutrition = scaled;
      plans[planIndex] = updatedPlan;
      saveToStorage('nutrition-tracker-plans', plans);
      renderPlans();
    }
  } else {
    alert('Primero crea un plan de comidas.');
  }
});

// Create plan
document.getElementById('createPlanBtn').addEventListener('click', () => {
  const name = document.getElementById('planName').value.trim();
  if (!name) {
    alert('Por favor ingresa un nombre para el plan.');
    return;
  }

  const plan = createMealPlan(name);
  const plans = getFromStorage('nutrition-tracker-plans') || [];
  plans.push(plan);
  saveToStorage('nutrition-tracker-plans', plans);

  document.getElementById('planName').value = '';
  activePlanId = plan.id;
  renderPlans();
});

// Render plans
function renderPlans() {
  const plans = getFromStorage('nutrition-tracker-plans') || [];
  const container = document.getElementById('plansList');

  if (plans.length === 0) {
    container.innerHTML = '<div class="card"><p>No hay planes de comidas creados aún.</p></div>';
    return;
  }

  let html = '';
  plans.forEach(plan => {
    const total = getMealPlanTotal(plan);
    const isActive = plan.id === activePlanId;

    html += `
      <div class="card" style="border-left: 4px solid ${isActive ? '#2d6a4f' : '#ddd'};">
        <div class="meal-plan-header">
          <h3>${plan.name} ${isActive ? '(Activo)' : ''}</h3>
          <div>
            <button class="secondary" onclick="window.selectPlan('${plan.id}')">Seleccionar</button>
            <button class="btn-delete" onclick="window.deletePlan('${plan.id}')">Eliminar</button>
          </div>
        </div>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="value">${total.calories.toFixed(1)}</div>
            <div class="label">Calorías</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.fats.toFixed(1)}</div>
            <div class="label">Grasas</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.saturatedFats.toFixed(1)}</div>
            <div class="label">Grasas sat.</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.carbohydrates.toFixed(1)}</div>
            <div class="label">Carbos</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.sugars.toFixed(1)}</div>
            <div class="label">Azúcares</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.fiber.toFixed(1)}</div>
            <div class="label">Fibra</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.protein.toFixed(1)}</div>
            <div class="label">Proteínas</div>
          </div>
          <div class="nutrition-item">
            <div class="value">${total.sodium.toFixed(2)}</div>
            <div class="label">Sodio</div>
          </div>
        </div>
        ${plan.items.length > 0 ? `
          <ul class="product-list" style="margin-top: 1rem;">
            ${plan.items.map(item => `
              <li>
                <div class="product-info">
                  <div class="name">${item.productId}</div>
                  <div class="grams">${item.grams}g</div>
                </div>
                <div>
                  ${item.nutrition ? `${item.nutrition.calories.toFixed(1)} kcal` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

// Global functions for inline event handlers
window.selectPlan = (id) => {
  activePlanId = id;
  renderPlans();
};

window.deletePlan = (id) => {
  if (!confirm('¿Estás seguro de eliminar este plan?')) return;
  let plans = getFromStorage('nutrition-tracker-plans') || [];
  plans = plans.filter(p => p.id !== id);
  saveToStorage('nutrition-tracker-plans', plans);
  if (activePlanId === id) activePlanId = null;
  renderPlans();
};

// Initial render
renderPlans();