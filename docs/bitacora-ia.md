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
  > los tres imports estaban rotos y faltaba el módulo del pool y el service. Se agregaron y crearon los archivos necesrios. En el repositorio de pacientes se reemplazaron para que se adapte.
- **Verificación:** 
  > se realizaron difentes solicitudes en bruno para comprobar que el endpoint funciona correctamente y devuelve los datos esperados.

---

### Entrada 4: DevOps
- **Paso:** Despliegue en Render y Vercel
- **Herramienta:** ChatGPT
- **Prompt:** 
  > "el deploy en Render falla con `Cannot find module '/opt/render/project/src/index.js'`, ¿qué tengo que configurar? y ¿dónde va la URL del backend en Vercel?"
- **Resultado:** 
  > Render ejecutaba `node index.js` en la raíz del repo, donde el entrypoint real está en `server/`. Se configuró Root Directory `server`, build `npm install` y start `npm start`. En Vercel, la variable `VITE_API_URL` en vez de hardcodear la URL en `pacienteService.js`.
- **Verificación:** 
  > se realizaron pruebas de despliegue en Render y Vercel, verificando que la aplicación se ejecuta correctamente y que las solicitudes al backend funcionan como se espera.

---

## Reflexión en Pareja

La Inteligencia Artificial se convirtió en un pilar fundamental a lo largo de todo el ciclo de desarrollo del proyecto, optimizando los tiempos de entrega y la calidad del código.

Gracias a su asistencia técnica, logramos destrabar con agilidad complejos desafíos relacionados con el diseño de la interfaz de usuario y la arquitectura de la base de datos.

Asimismo, optimizó significativamente las tareas de control de calidad al facilitar una revisión exhaustiva de los endpoints y agilizar los procesos de despliegue en producción.

Mantuvimos siempre un riguroso criterio de validación, verificando y probando cada una de sus sugerencias para garantizar su absoluta estabilidad y correcto funcionamiento.

En definitiva, su integración no solo aceleró nuestro ritmo de trabajo, sino que también profundizó nuestra comprensión global del sistema y sus componentes
