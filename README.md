# Nutrition Tracker

Una aplicación web gratuita y sin anuncios para rastrear tu ingesta nutricional escaneando etiquetas de productos y creando planes de comidas personalizados.

## Características

- **OCR con IA**: Escanea fotos de etiquetas nutricionales y extrae la información automáticamente usando un modelo de IA compatible con OpenAI.
- **Cálculo nutricional**: Calcula los valores nutricionales para cualquier cantidad de gramos de un producto.
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

1. Abre la aplicación en tu navegador.
2. Ve a la sección "Configuración".
3. Ingresa la URL del endpoint (ej: `https://api.openai.com/v1`).
4. Ingresa tu clave API.
5. Guarda la configuración.

La aplicación usará este endpoint para procesar las imágenes y extraer la información nutricional.

## Cómo Usar

### Escanear una Etiqueta

1. Ve a la sección "Escanear".
2. Selecciona o toma una foto de la etiqueta nutricional de un producto.
3. Haz clic en "Escanear".
4. La IA extraerá la información nutricional.
5. Especifica los gramos que vas a consumir.
6. Haz clic en "Agregar al plan" para añadirlo a un plan de comidas activo.

### Crear un Plan de Comidas

1. Ve a la sección "Planes".
2. Ingresa un nombre para el plan (ej: "Desayuno", "Almuerzo").
3. Haz clic en "Crear Plan".
4. Selecciona el plan como activo.
5. Agrega productos escaneados o manualmente.

### Ver Totales Nutricionales

Cada plan muestra los totales nutricionales de todos los productos incluidos:

- Calorías (kcal)
- Grasas totales (g)
- Grasas saturadas (g)
- Carbohidratos (g)
- Azúcares (g)
- Fibra (g)
- Proteínas (g)
- Sodio (g)

## Cómo Probar

Ejecuta los tests con Node.js:

```bash
node --test tests/*.test.js
```

## Estructura del Proyecto

```
├── src/
│   ├── ocr.js           # Módulo OCR (extracción con IA)
│   ├── nutrition.js     # Cálculos nutricionales
│   ├── meal-planner.js  # Gestión de planes de comidas
│   └── storage.js       # Persistencia en localStorage
├── public/
│   ├── index.html       # Interfaz de usuario
│   └── app.js           # Lógica del frontend
├── tests/
│   ├── ocr.test.js      # Tests del módulo OCR
│   ├── nutrition.test.js # Tests de cálculos nutricionales
│   ├── meal-planner.test.js # Tests del planificador
│   └── storage.test.js  # Tests de almacenamiento
├── docs/
│   └── SPEC.md          # Especificación del producto
└── package.json
```

## Lo que aún no está implementado

- **OCR real con IA**: El módulo `ocr.js` está estructurado para llamar al endpoint de IA configurado, pero la implementación actual es un placeholder. Se necesita integrar la llamada real a la API de IA.
- **Base de datos de productos**: No hay una base de datos predefinida de productos. Los productos se escanean desde las etiquetas.
- **Sincronización en la nube**: Los datos se almacenan localmente en el navegador (localStorage). No hay sincronización entre dispositivos.
- **Exportación de datos**: No se puede exportar los planes de comidas a formatos como CSV o PDF.
- **Notificaciones y recordatorios**: No hay sistema de notificaciones para recordar tomar comidas.
- **Soporte multiidioma**: La interfaz está en español, pero no hay traducciones disponibles.

## Licencia

Este proyecto es gratuito y sin anuncios. Puedes usarlo, modificarlo y distribuirlo libremente.