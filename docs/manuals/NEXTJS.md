# Manual de Referencia: Next.js

Este documento cubre el flujo de trabajo, estructura y comandos específicos para el desarrollo con Next.js (App Router).

## Comandos del CLI (vía NPM)

| Comando | Descripción | Contexto |
| :--- | :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Hot Reload. | Desarrollo |
| `npm run build` | Crea una compilación optimizada para producción. | Despliegue |
| `npm start` | Arranca el servidor de producción usando los archivos de `build`. | Producción |
| `npm run lint` | Verifica el cumplimiento de las reglas de ESLint configuradas para Next.js. | Calidad |

## Estructura de Carpetas (App Router)

- **`src/app`**: Contiene las rutas de la aplicación.
    - **`page.tsx`**: UI de una ruta específica.
    - **`layout.tsx`**: UI compartida (wrappers) para una ruta y sus hijas.
    - **`loading.tsx`**: UI de carga (Suspense) automática.
    - **`error.tsx`**: Manejo de errores para la ruta.
    - **`route.ts`**: Define endpoints de API (Backend).
- **`src/components`**: Componentes reutilizables (Botones, Tablas, Headers).
- **`src/lib`**: Utilidades, configuraciones de librerías y lógica de negocio pura.
- **`public`**: Archivos estáticos (imágenes, fuentes) accesibles desde `/`.

## Conceptos Clave

### Server Components vs Client Components
- **Server Components (Por defecto)**: Renderizados en el servidor. No pueden usar `useState`, `useEffect` ni eventos del navegador (`onClick`). Ideales para acceso a BD y SEO.
- **Client Components**: Deben iniciar con `'use client'`. Permiten interactividad (`useState`, `onClick`). Se renderizan en el servidor y se hidratan en el cliente.

### Routing Dinámico
Para crear rutas dinámicas (ej: `/dashboard/aws`, `/dashboard/localstack`), use carpetas con corchetes:
- `src/app/dashboard/[provider]/page.tsx`
- En el código: `params.provider` capturará el valor ("aws" o "localstack").

### Data Fetching
Next.js extiende `fetch` para gestionar caché y revalidación:
```typescript
// Revalidar cada 3600 segundos
fetch('https://api.ejemplo.com', { next: { revalidate: 3600 } })

// No cachear (SSR puro)
fetch('https://api.ejemplo.com', { cache: 'no-store' })
```

---
**Recurso Oficial:** [Documentación de Next.js](https://nextjs.org/docs)
