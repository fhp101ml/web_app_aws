
# ExoCluster - Cloud Management Platform (v1.1.0-AI)

**ExoCluster** es una plataforma moderna para la gestión centralizada de recursos en la nube. Esta versión **v1.1 - "AI Ops & Service Core"** expande las capacidades del agente inteligente y refactoriza el núcleo del sistema para mayor robustez.

## 🚀 Funcionalidades Actuales

### 1. Autenticación y Seguridad
- **Login Seguro**: Sistema robusto basado en `NextAuth.js` con credenciales (Email/Password).
- **Protección de Rutas**: Middleware que protege `/dashboard` y sub-rutas.
- **Roles de Usuario**: Distinción entre `ADMIN` y `USER`.
- **Registro de Usuarios**: Formulario de registro público con aprobación de admin.
- **Gestión de Sesión**: Cierre de sesión seguro con limpieza de estado.

### 2. Cumplimiento Normativo (LegalTech Module)
Sistema completo diseñado para cumplir con **RGPD (UE)** y **LSSI**:
- **Páginas Legales Premium**: Diseño "Security-First" para `/legal/privacy` y `/legal/terms`.
- **Gestión de Consentimiento (CMP)**:
  - Sistema de cookies profesional con control granular.
  - Persistencia local y emisión de eventos (`cookie_consent_updated`).
  - Interfaz de "Aceptación Vinculante" con firma digital visual.
- **Derechos ARCO del Usuario**:
  - **Portabilidad de Datos**: Exportación completa de perfil en formato JSON (`/api/profile/export`), accesible también vía IA.
  - **Derecho al Olvido**: Eliminación irreversible de cuenta y datos asociados.

### 3. Service Layer Architecture (Nuevo) 🛡️
- **Arquitectura de Servicios**: Lógica de negocio centralizada en `src/lib/services/` (`UserService`, `WorkspaceService`).
- **MCP Integration**: El Modelo de Protocolo de Contexto (MCP) se conecta directamente a estos servicios, permitiendo al agente IA realizar las mismas acciones que la API REST.

### 4. Gestión de Usuarios y Workspaces
- **Usuarios (Admin)**: Creación, borrado, y edición completa de usuarios (incluyendo roles y estado activo) desde Panel y Chat.
- **Workspaces**: Creación y listado de espacios de trabajo con aislamiento lógico y visibilidad basada en roles.

### 5. Asistente Virtual Inteligente (MCP Powered) 🤖
- **Chatbot Integrado**: Widget flotante alimentado por LangChain y OpenAI.
- **Capacidades Ops**:
  - **Gestión de Usuarios**: "Crea un usuario admin llamado Pepe", "Pruébame la cuenta de usuario@test.com".
  - **Workspaces**: "Crea un workspace llamado Producción".
  - **Consultas**: "Lista todos los usuarios activos".
- **Client-Side Magic**: Capacidad de realizar acciones en el navegador del usuario.
  - *Ejemplo*: "Pon modo oscuro" cambia el tema instantáneamente sin recargar.

### 6. Interfaz de Usuario (UI/UX)
- **Diseño Premium**: Estética moderna con Glassmorphism, desenfoques y sombras sutiles.
- **Sistema de Temas**: Soporte nativo para modo oscuro/claro, controlable vía IA.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **IA/Agent**: LangChain, LangGraph, Model Context Protocol (MCP)
- **Base de Datos**: SQLite (Dev) / Prisma ORM
- **Autenticación**: NextAuth.js v4
- **Estilos**: Raw CSS Modules + Variables CSS

---

## ⚙️ Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+
- NPM
- OpenAI API Key

### 2. Instalación
```bash
npm install
```

### 3. Configuración de Entorno (.env)
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"
OPENAI_API_KEY="sk-..."
```

### 4. Inicialización
```bash
npx prisma generate
npx prisma db push
node scripts/create-admin.js
```

---

## 📝 Historial de Versiones

### **v1.1.0-AI**: "AI Ops & Service Core"
- ✅ **Service Layer Refactor**: Centralización de lógica en `UserService` y `WorkspaceService`.
- ✅ **MCP Expansion**: 8 herramientas nuevas para el agente (Admin, Workspaces, Export).
- ✅ **Client-Side AI Actions**: Protocolo para que la IA controle la UI (e.g., cambiar tema).
- ✅ **System Prompt**: Definición robusta de capacidades del agente.

### **v1.0.0**: "Legal & Compliance Core"
- ✅ Rediseño completo de páginas legales y CMP.
- ✅ Funciones de privacidad GDPR.

---

## 🚧 Roadmap
- [ ] **Dashboard de Métricas**: Visualización de uso de CPU/RAM de "nubes" simuladas.
- [ ] **Integración Real AWS**: Conexión con AWS SDK para provisión real.
