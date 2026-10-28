# Bitácora de Uso de IA Generativa - Mini Proyecto vetChiloé

## Registro de Interacciones

### Entrada 1: Frontend
- **Paso:** Paso 1 - Implementación del componente BuscadorPaciente
- **Herramienta:** ChatGPT
- **Prompt:** 
  > "adapta el archivo BuscadorPaciente.jsx para que se adapte a mi repositorio"
- **Resultado:** 
  > se itero de vuelta para adaptar el icono de lucid-react e integrarlo al repositorio
- **Verificación:** 
  > se realizo una verificacion visual en el navegador para ver si se integro bien en el repositorio

---

### Entrada 2: Base de Datos (SQL)
- **Paso:** Paso 4 - Creacion de Funciones
- **Herramienta:** ChatGPT
- **Prompt:** 
  > "de acuerdo a las funciones base y los datos del repositorio, adapta las funciones a los datos"
- **Resultado:** 
  > funciono y los datos de las funciones correspondian a las funciones previamente usadas
- **Verificación:** 
  > se realizaron verificaciones en EDITOR SQL en neon para comprobar si funcionan.

---

### Entrada 3: Backend (N-Capas)
- **Paso:** Controlador, servicio y repositorio para endpoint /api/pacientes/buscar
- **Herramienta:** ChatGPT
- **Prompt:** 
  > "adapta estos archivos de routes, controller y repository que hizo mi compañero para que funcionen en mi repositorio, que ya tiene la tabla pacientes y las funciones creadas en PostgreSQL"
- **Resultado:** 
  > los tres imports estaban rotos (`../controller/` en singular, `../service/server/funciones.service.js`) y faltaba el módulo del pool y el service. Se agregó `server/lib/db.js`, se creó `server/services/funciones.service.js`, se renombró `buscar.routes.js` a `funciones.routes.js` agregando `/resumen`, y `Buscar({text})` pasó a `buscar(texto)`. En el repositorio de pacientes se reemplazó el `LOCK` + `MAX` por `registrar_paciente($1..$9)`. También apareció que `pg` entrega los BIGINT como texto, de ahí el `Number(fila.total)`.
- **Verificación:** 
  > se realizaron difentes solicitudes en bruno para comprobar que el endpoint funciona correctamente y devuelve los datos esperados.

---

### Entrada 4: DevOps
- **Paso:** Despliegue en Render y Vercel, y aplicación de `sql/funciones.sql` en Neon
- **Herramienta:** ChatGPT
- **Prompt:** 
  > "el deploy en Render falla con `Cannot find module '/opt/render/project/src/index.js'`, ¿qué tengo que configurar? y ¿dónde va la URL del backend en Vercel?"
- **Resultado:** 
  > el diagnóstico fue correcto: Render ejecutaba `node index.js` en la raíz del repo, donde el entrypoint real está en `server/`. Se configuró Root Directory `server`, build `npm install` y start `npm start`. En Vercel, la variable `VITE_API_URL` en vez de hardcodear la URL en `pacienteService.js`. Se descartó la instrucción de editar el código porque la URL que traía ni siquiera era la nuestra. El SQL se aplicó con el SQL Editor de Neon.
- **Verificación:** 
  > `curl` a los endpoints en producción: `/api/pacientes` 200, `/buscar?q=mer` 200, `/resumen` 200 con `total` numérico. En el navegador se revisó que el bundle desplegado en Vercel apunte a `vetchiloe-wyio.onrender.com` y no a `localhost`.

---

## Reflexión en Pareja

Nos sirvió para dos cosas concretas: leer rápido lo que no entendíamos, como los imports rotos de los archivos que nos pasamos entre nosotros o el error de Render que no decía nada útil, y para el detalle de que `pg` devuelve los BIGINT como texto.

También se equivocó, y de formas que costaban caro: propuso hardcodear una URL de Render que no era la nuestra (`vetchiloe-api` en vez de `vetchiloe-wyio`), escribió el buscador con clases de Tailwind en un proyecto que no usa Tailwind y con un import de `lucide-react` que no compilaba.

Lo más incómodo fue `registrar_paciente`: la armó con los parámetros de nuestra tabla y no con los del enunciado, así que la prueba del profesor falló con `function registrar_paciente(...) does not exist`.

La lección fue simple: el PDF se lee antes de pedir código, y ninguna respuesta se da por buena hasta correrla en Neon, en el navegador o en Bruno.
