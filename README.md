# Nutrition Tracker

Una aplicación web gratuita y sin anuncios para rastrear tu ingesta nutricional escaneando etiquetas de productos y creando planes de comidas personalizados.

## Características

- **OCR con IA**: Escanea fotos de etiquetas nutricionales y extrae la información automáticamente usando un modelo de IA compatible con OpenAI.
- **Cálculo nutricional**: Calcula los valores nutricionales para cualquier cantidad de gramos de un producto, escalando según el tamaño de porción.
- **Planes de comidas personalizados**: Crea y gestiona planes de comidas con múltiples productos.
- **Seguimiento nutricional**: Visualiza el total de calorías, grasas, carbohidratos, proteínas, sodio y más.
- **Gratuito y sin anuncios**: Totalmente gratis, sin publicidad ni suscripciones.

## Stack Tecnológico

- **Backend/Logic**: Node 24 con ES modules (módulos ES)
- **Frontend**: Página web estática (HTML/CSS/JS)
- **Testing**: Node built-in test runner (`node --test`)
- **OCR con IA**: Módulo que llama a un endpoint OpenAI-compatible configurado por el usuario

## Instalación

No se requiere build step ni dependencias externas. Solo necesitas Node.js 24+.

```bash
# Clonar el repositorio
git clone https://github.com/satoriagent01/nutrition-tracker-ynh2s.git
cd nutrition-tracker-ynh2s
```

## Configuración del Endpoint de IA

Para usar la funcionalidad de OCR, necesitas configurar un endpoint compatible con OpenAI:

1. Abre la aplicación en tu navegador (abre `public/index.html` directamente).
2. Ve a la sección "Settings" (Configuración).
3. Ingresa tu clave API de OpenAI (o de cualquier servicio compatible).
4. Guarda la configuración.

La aplicación usará este endpoint para procesar las imágenes y extraer la información nutricional.

### Variables de entorno (para pruebas en Node)

Las pruebas en Node no requieren configuración de API key ya que mockean las llamadas.

## Cómo Usar

### Escanear una Etiqueta

1. Ve a la sección "Scan" (Escanear).
2. Selecciona o toma una foto de la etiqueta nutricional de un producto.
3. Haz clic en "Extract Nutrition" (Extraer Nutrición).
4. La IA extraerá la información nutricional.
5. Especifica los gramos que vas a consumir.
6. Haz clic en "Add to Plan" (Agregar al Plan) para añadirlo a un plan de comidas.

### Crear un Plan de Comidas

1. Ve a la sección "Meal Plan" (Plan de Comidas).
2. Ingresa un nombre para tu plan.
3. Haz clic en "Create Plan" (Crear Plan).
4. Agrega productos al plan especificando la cantidad en gramos.
5. Visualiza el total nutricional del plan.

## Cómo Probar

```bash
# Ejecutar todas las pruebas
node --test tests/*.test.js

# Ejecutar una prueba específica
node --test tests/nutrition.test.js
```

## Módulos

### `src/ocr.js`
Extrae información nutricional de imágenes usando un endpoint OpenAI-compatible.

```javascript
import { extractNutrition } from "./ocr.js";

const result = await extractNutrition(
  { imageData: base64String },
  { apiKey: "your-api-key", endpoint: "https://api.openai.com/v1/chat/completions" }
);
```

### `src/nutrition.js`
Calcula valores nutricionales escalados según la cantidad de gramos.

```javascript
import { calculateNutrition } from "./nutrition.js";

const result = calculateNutrition(productNutrition, 30);
```

### `src/meal-planner.js`
Gestiona planes de comidas con múltiples productos.

```javascript
import { createMealPlan, addProductToMealPlan, getMealPlanTotal } from "./meal-planner.js";

const plan = createMealPlan("Mi Plan");
const updatedPlan = addProductToMealPlan(plan, "product-1", 30, productNutrition);
const total = getMealPlanTotal(updatedPlan);
```

### `src/storage.js`
Persistencia de datos usando localStorage.

```javascript
import { saveToStorage, getFromStorage } from "./storage.js";

saveToStorage("key", { data: "value" });
const value = getFromStorage("key");
```

## Lo que no está hecho aún

- No se ha implementado la integración real con un servicio de OCR (se requiere una API key válida).
- No hay backend: la aplicación es completamente frontend.
- No hay autenticación de usuarios.
- No hay sincronización con la nube.
- No hay soporte para múltiples idiomas además del español.