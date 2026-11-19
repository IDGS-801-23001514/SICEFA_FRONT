# React SICEFA (Visual Studio)

1. Selecciona **File > Open > Folder** en Visual Studio y elige esta carpeta.
2. Instala **Node.js 22.20 o superior**.
3. En la terminal de Visual Studio ejecuta:
   ```
   npm install
   npm run dev
   ```
4. Accede a `http://localhost:5173`. Deja corriendo la API en `http://localhost:5086`.
5. Para probar instalación PWA: `npm run build` y `npm run preview`, luego `http://localhost:4173`.

El frontend usa Vite con proxy `/api`, cookies HttpOnly y validación de sesión automática tras recargar. Nunca conecta directamente a MySQL. Iconos: Lucide. CSS: `src/styles.css`.

Las pantallas se inspiran en el archivo Figma SICEFA: https://www.figma.com/design/Mers5R6iZfQBNEkjbrgfPx
