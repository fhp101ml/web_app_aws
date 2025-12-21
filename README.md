
# ExoCluster - Cloud Management Platform (v1.0.0)

**ExoCluster** es una plataforma moderna para la gestión centralizada de recursos en la nube. Esta versión **v1.0 - "Legal & Compliance Core"** consolida la arquitectura base, la seguridad avanzada y un sistema integral de cumplimiento normativo (RGPD/LSSI).

## 🚀 Funcionalidades Actuales

### 1. Autenticación y Seguridad
- **Login Seguro**: Sistema robusto basado en `NextAuth.js` con credenciales (Email/Password).
- **Protección de Rutas**: Middleware que protege `/dashboard` y sub-rutas.
- **Roles de Usuario**: Distinción entre `ADMIN` y `USER`.
- **Registro de Usuarios**: Formulario de registro público con aprobación de admin.
- **Gestión de Sesión**: Cierre de sesión seguro con limpieza de estado.

### 2. Cumplimiento Normativo (LegalTech Module) 🆕
Sistema completo diseñado para cumplir con **RGPD (UE)** y **LSSI**:
- **Páginas Legales Premium**: Diseño "Security-First" para `/legal/privacy` y `/legal/terms`.
- **Gestión de Consentimiento (CMP)**:
  - Sistema de cookies profesional con control granular (Necesarias, Preferencias, Estadísticas, Marketing).
  - Persistencia local y emisión de eventos (`cookie_consent_updated`).
  - Interfaz de "Aceptación Vinculante" con firma digital visual.
- **Derechos ARCO del Usuario**:
  - **Portabilidad de Datos**: Exportación completa de perfil en formato JSON (`/api/profile/export`).
  - **Derecho al Olvido**: Eliminación irreversible de cuenta y datos asociados.

### 3. Gestión de Usuarios (Admin)
- **Panel de Administración**: Vista tabular estilizada de todos los usuarios registrados.
- **Aprobación de Cuentas**: Los administradores pueden aprobar o rechazar nuevos registros.
- **Eliminación**: Capacidad para eliminar usuarios del sistema.

### 4. Perfil de Usuario Avanzado
- **Gestión de Identidad**: Actualización de nombre y contraseña.
- **Personalización**: Preferencia de **Tema (Claro/Oscuro)** persistente en base de datos.
- **UX Mejorada**: Iconografía premium "outline", Glassmorphism, feedback visual.

### 5. Interfaz de Usuario (UI/UX)
- **Diseño Premium**: Estética moderna con Glassmorphism, desenfoques y sombras sutiles.
- **Sistema de Temas**: Soporte nativo para modo oscuro/claro, sincronizado con la sesión.
- **Navegación Intuitiva**: Header consolidado con menú de usuario desplegable.

### 6. Rendimiento y Seguridad
- **Rate Limiting**: Protección Token Bucket en API Routes (`src/lib/rate-limit.ts`).
- **Seguridad HTTP**: Headers de seguridad (CSP, HSTS, X-Frame-Options).
- **Accesibilidad**: Cumplimiento WCAG 2.1 AA (contrastes, navegación por teclado, aria-labels).

### 7. Asistente Virtual Inteligente 🤖
- **Chatbot Integrado**: Widget flotante accesible desde cualquier punto de la aplicación.
- **Soporte Contextual**: Respuestas generadas por IA para ayudar en la gestión de la plataforma.
- **Diseño Adaptativo**: Interfaz limpia con soporte de tema invertido para mejor legibilidad.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite (Dev) / PostgreSQL (Prod ready)
- **ORM**: Prisma
- **Autenticación**: NextAuth.js v4
- **Estilos**: Raw CSS Modules + Variables CSS (Zero-Runtime Overhead)

---

## ⚙️ Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+
- NPM

### 2. Instalación
```bash
npm install
```

### 3. Configuración de Entorno (.env)
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"
# NEXTAUTH_URL="http://localhost:3000" # Opcional
```

### 4. Base de Datos
```bash
npx prisma generate
npx prisma db push
```

### 5. Crear Super Admin
```bash
node scripts/create-admin.js
```
*(Credenciales por defecto en la salida del script)*

---

## ▶️ Ejecución

```bash
npm run dev
```
Acceso en: `http://localhost:3000`

---

## 📝 Historial de Versiones

### **v1.0.0**: "Legal & Compliance Core" (Release Actual)
Consolidación del módulo legal y derechos de usuario.
- ✅ Rediseño completo de páginas legales (Estilo Cloud Console).
- ✅ Sistema de consentimiento de cookies granular (Cookiebot-style).
- ✅ Funciones de privacidad: Exportar datos y Eliminar cuenta.
- ✅ Mejoras visuales en botones de confirmación legal.

### **v0.1.0**: "Alpha Core"
- ✅ Autenticación, Gestión de Usuarios, Dashboard básico.

---

## 🚧 Roadmap (Próximos pasos)

### Fase 5: Refinamiento Visual y Futuro
- [ ] **Gestión Avanzada de Cookies**: Dashboard de auditoría de cookies para admins.
- [ ] **Rediseño Visual de Inicio**: Eliminar diseño plano, adoptar estilo landing page SaaS.
- [ ] **Rediseño Formulario de Acceso**: Estilo Glassmorphism con validaciones animadas.

### Infraestructura
- [ ] Migración a PostgreSQL/MySQL externa.
- [ ] Scripts de migración de datos producción.
