# Especificación del Producto: Nutrition Tracker

## 1. Visión General
Una aplicación web gratuita y sin anuncios que permite a los usuarios rastrear su ingesta nutricional escaneando etiquetas de productos y creando planes de comidas personalizados.

## 2. Stack Tecnológico
- **Backend/Logic**: Node 24 con ES modules (módulos ES)
- **Testing**: Node built-in test runner (`node --test`)
- **Frontend**: Página web estática en `public/`
- **OCR con IA**: Módulo que llama a un endpoint OpenAI-compatible configurado por el usuario (URL y clave API)
- **Sin build step**: Todo se ejecuta directamente con Node

## 3. Módulos y Funciones

### `src/ocr.js` - Extracción de información nutricional
- **`extractNutrition(imageData) → Promise<NutritionData>`**: Extrae información nutricional de una imagen (base64 o URL).
  - **Entrada**: `{ imageData: string }` (imagen en base64)
  - **Salida**: `{ calories: number, fats: number, saturatedFats: number, carbohydrates: number, sugars: number, fiber: number, protein: number, sodium: number, servingSize: string, servingUnit: string }`
  - **Ejemplo**: De la imagen 1 (barra de chocolate), extrae: `{ calories: 549, fats: 33, saturatedFats: 13, carbohydrates: 55, sugars: 45, fiber: 2.4, protein: 6.8, sodium: 0.18, servingSize: "100g", servingUnit: "g" }`

### `src/nutrition.js` - Cálculos nutricionales
- **`calculateNutrition(productNutrition, grams) → NutritionData`**: Calcula los valores nutricionales para una cantidad específica de gramos.
  - **Entrada**: `{ productNutrition: NutritionData, grams: number }`
  - **Salida**: `{ calories: number, fats: number, saturatedFats: number, carbohydrates: number, sugars: number, fiber: number, protein: number, sodium: number }`
  - **Ejemplo**: `calculateNutrition({ calories: 549, fats: 33, ... }, 30)` → `{ calories: 164.7, fats: 9.9, ... }`

### `src/meal-planner.js` - Planificador de comidas
- **`createMealPlan(name) → MealPlan`**: Crea un nuevo plan de comidas.
  - **Entrada**: `{ name: string }`
  - **Salida**: `{ id: string, name: string, items: [], createdAt: Date }`
- **`addProductToMealPlan(mealPlan, productId, grams) → MealPlan`**: Añade un producto al plan de comidas.
  - **Entrada**: `{ mealPlan: MealPlan, productId: string, grams: number }`
  - **Salida**: `{ ...mealPlan, items: [...mealPlan.items, { productId, grams, nutrition: NutritionData }] }`
- **`getMealPlanTotal(mealPlan) → NutritionData`**: Calcula el total nutricional del plan de comidas.
  - **Entrada**: `{ mealPlan: MealPlan }`
  - **Salida**: `{ calories: number, fats: number, saturatedFats: number, carbohydrates: number, sugars: number, fiber: number, protein: number, sodium: number }`

### `src/storage.js` - Almacenamiento local
- **`saveToStorage(key, value) → void`**: Guarda datos en localStorage.
  - **Entrada**: `{ key: string, value: any }`
- **`getFromStorage(key) → any`**: Recupera datos de localStorage.
  - **Entrada**: `{ key: string }`
  - **Salida**: `any` (el valor guardado o null si no existe)

## 4. Criterios de Aceptación

### AC-1: Escaneo de Etiquetas
- El usuario puede tomar una foto de una etiqueta nutricional.
- La aplicación extrae correctamente la información nutricional de la imagen.
- Se soportan múltiples idiomas (español, inglés, alemán, francés, italiano, neerlandés).

### AC-2: Extracción de Información Nutricional
- Se extraen correctamente: calorías, grasas totales, grasas saturadas, carbohidratos, azúcares, fibra, proteínas y sodio.
- Se identifica el tamaño de la porción y su unidad (g, ml, etc.).
- Los valores se normalizan a por 100g/ml para facilitar el cálculo.

### AC-3: Planificador de Comidas
- El usuario puede crear planes de comidas personalizados.
- Se pueden añadir productos al plan especificando la cantidad en gramos.
- Se calcula automáticamente el total nutricional del plan.

### AC-4: Rastreo Nutricional
- El usuario puede ver el total nutricional de su plan de comidas.
- Se pueden rastrear calorías, grasas, sodio y cualquier otro nutriente.
- Los datos se guardan localmente para persistencia.

### AC-5: Interfaz de Usuario
- La aplicación es una página web estática accesible desde cualquier navegador.
- No requiere instalación ni registro.
- Es gratuita y sin anuncios.

### AC-6: OCR con IA
- La extracción de texto se realiza mediante un endpoint OpenAI-compatible.
- El usuario configura su propia URL y clave API.
- Los tests no llaman al endpoint de IA (se mockean las llamadas).

## 5. Ejemplos de las Imágenes Compartidas

### Imagen 1: Barra de Chocolate (Dr. Schär)
- **Producto**: Barra de chocolate sin gluten
- **Idiomas**: Alemán, francés, neerlandés, italiano
- **Valores por 100g**:
  - Energía: 2292 kJ / 549 kcal
  - Grasas: 33g (de las cuales saturadas: 13g)
  - Carbohidratos: 55g (de los cuales azúcares: 45g)
  - Fibra: 2.4g
  - Proteínas: 6.8g
  - Sal: 0.18g
- **Porción**: 30g (1 Melto)

### Imagen 2: Zumo de Frutas
- **Producto**: Zumo de manzana, naranja y mango
- **Idioma**: Neerlandés
- **Valores por 100ml**:
  - Energía: 199 kJ / 47 kcal
  - Grasas: 0g
  - Carbohidratos: 11g (de los cuales azúcares: 10g)
  - Proteínas: 0.7g
  - Sal: 0.4g
- **Porción**: 200ml (1 vaso)

### Imagen 3: Aceite de Oliva
- **Producto**: Aceite de oliva extra virgen
- **Idioma**: Neerlandés
- **Valores por 100ml**:
  - Energía: 3404 kJ / 828 kcal
  - Grasas: 92g (de las cuales saturadas: 14g)
  - Carbohidratos: 0g (de los cuales azúcares: 0g)
  - Proteínas: 0g
  - Sal: 0g
- **Porción**: 200ml

## 6. Consideraciones Técnicas

### OCR con IA
- Se utiliza un endpoint OpenAI-compatible (como OpenAI, Azure, o cualquier servicio similar).
- El usuario configura su propia URL y clave API en la interfaz.
- Las llamadas al endpoint se mockean en los tests para evitar llamadas reales.

### Almacenamiento
- Se utiliza localStorage para persistir los datos del usuario.
- No se requiere backend ni base de datos.

### Testing
- Se utiliza el test runner integrado de Node (`node --test`).
- Los tests son deterministas y no llaman a servicios externos.
- Se mockean las llamadas al endpoint de IA.

### Interfaz de Usuario
- La interfaz es una página web estática en `public/`.
- No se requiere build step ni framework frontend.
- Se utiliza HTML, CSS y JavaScript vanilla.