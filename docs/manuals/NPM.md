# Manual de Referencia: NPM (Node Package Manager)

Este documento detalla los comandos esenciales de NPM para gestionar paquetes, scripts y auditorías en el proyecto.

## Comandos Básicos

| Comando | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `npm install` | Instala todas las dependencias listadas en `package.json`. | `npm install` |
| `npm install <paquete>` | Instala un paquete específico y lo añade a `dependencies`. | `npm install axios` |
| `npm install -D <paquete>` | Instala un paquete como dependencia de desarrollo (`devDependencies`). | `npm install -D typescript` |
| `npm uninstall <paquete>` | Desinstala un paquete y lo elimina de `package.json`. | `npm uninstall lodash` |
| `npm update` | Actualiza los paquetes a sus últimas versiones compatibles según `package.json`. | `npm update` |

## Ejecución de Scripts

Los scripts se definen en la sección `"scripts"` del archivo `package.json`.

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo (usualmente en `localhost:3000`). |
| `npm run build` | Compila la aplicación para producción. |
| `npm start` | Inicia la aplicación en modo producción (requiere previo `build`). |
| `npm run lint` | Ejecuta el linter (ESLint) para buscar errores de código. |

## Gestión de Caché y Auditoría

| Comando | Descripción |
| :--- | :--- |
| `npm audit` | Escanea el proyecto en busca de vulnerabilidades de seguridad en las dependencias. |
| `npm audit fix` | Intenta corregir automáticamente las vulnerabilidades encontradas. |
| `npm cache clean --force` | Limpia la caché local de npm (útil si hay errores extraños de instalación). |

## Información del Proyecto

| Comando | Descripción |
| :--- | :--- |
| `npm list` | Muestra el árbol de dependencias instaladas en el proyecto. |
| `npm list --depth=0` | Muestra solo los paquetes de primer nivel (sin subdependencias). |
| `npm outdated` | Muestra los paquetes que tienen versiones nuevas disponibles. |

---
**Nota:** Siempre verifica el archivo `package.json` para ver los scripts específicos configurados para este proyecto.
