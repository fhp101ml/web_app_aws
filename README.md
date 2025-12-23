
# ExoCluster - Cloud Management Platform (v1.3.0)

**ExoCluster** es una plataforma moderna para la gestión centralizada de recursos en la nube. Esta versión **v1.3 - "Modular Cloud Console"** introduce un dashboard completamente rediseñado, modular y conectado a datos reales de AWS, replicando la experiencia de consola profesional.

## 🚀 Funcionalidades Actuales

### 1. Modular Dashboard (Nuevo en v1.3) 🧩
Experiencia de usuario inspirada en la AWS Console Home:
- **Grid Configurable**: Sistema de filas y columnas (3-col grid) que permite organizar widgets.
- **Widgets Inteligentes**:
  - **Cost & Usage**: Visualización de costes reales (AWS Cost Explorer).
  - **Health**: Estado de salud de los servicios.
  - **Recent Resources**: Últimas instancias, buckets y funciones accedidas.
  - **Favorites**: Accesos directos a servicios frecuentes.
- **Drag & Drop (Beta)**: Capacidad de reordenar widgets y personalizar la vista.
- **Persistencia Visual**: El diseño personalizado se guarda localmente.

### 2. Integración Real AWS (Nuevo en v1.3) ☁️
- **AWS SDK V3**: Conexión nativa a servicios reales (EC2, S3, Lambda, RDS, Cost Explorer).
- **Datos en Tiempo Real**: Las tablas y gráficos reflejan el estado actual de la infraestructura.
- **Gestión de EC2**: Lanzar, detener y terminar instancias directamente desde la UI.

### 3. Autenticación y Seguridad
- **Login Seguro**: Sistema robusto basado en `NextAuth.js`.
- **Protección de Rutas**: Middleware de seguridad.
- **Roles**: Admin/User y gestión de usuarios.

### 4. Cumplimiento Normativo (LegalTech)
- Paginas legales RGPD/LSSI.
- Gestión de consentimientos y cookies.
- Derechos ARCO y portabilidad de datos.

### 5. Service Layer Architecture
- Arquitectura escalable basada en Servicios (`UserService`, `CloudService`).
- Integración profunda con **MCP (Model Context Protocol)** para agentes de IA.

### 6. Asistente Virtual Inteligente 🤖
- Chatbot integrado con capacidad de operar la plataforma ("Crea un usuario", "Pon modo oscuro").
- **Self-Healing UI**: La interfaz reacciona a los cambios realizados por el agente.

---

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Cloud integration**: AWS SDK v3
- **IA Core**: LangChain, LangGraph, MCP
- **Base de Datos**: SQLite (Dev) / Prisma ORM
- **Estilos**: Modular CSS "Clean Enterprise" Theme

---

## ⚙️ Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+
- AWS Credentials (profile o variables de entorno)
- OpenAI API Key

### 2. Instalación
```bash
npm install
```

### 3. Configuración de Entorno (.env)
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-clave-secreta"
OPENAI_API_KEY="sk-..."
# AWS Credentials (opcional si usas ~/.aws/credentials)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
```

### 4. Inicialización
```bash
npx prisma generate
npx prisma db push
node scripts/create-admin.js
npm run dev
```

---

## 📝 Historial de Versiones

### **v1.3.0**: "Modular Cloud Console"
- ✅ **Console Home Redesign**: Dashboard baseado en widgets y filas configurables.
- ✅ **Real AWS Data**: Integración completa de AWS SDK (Cost, Lambda, RDS, EC2).
- ✅ **Clean Aesthetic**: Nuevo tema visual moderno (tarjetas blancas, sombras suaves).
- ✅ **Drag & Drop**: Implementación de motor de arrastrar y soltar para widgets.

### **v1.2.0-AI**: "Self-Healing & Profile AI"
- ✅ **Profile MCP Tools**: Herramientas para gestión de perfil por IA.
- ✅ **Reactive Refresh**: Bus de eventos para actualizaciones UI.

### **v1.1.0-AI**: "AI Ops & Service Core"
- ✅ **Service Layer Refactor**: Centralización lógica de negocio.
- ✅ **MCP Expansion**: Herramientas de administración para el agente.

---

## 🚧 Roadmap
- [x] **Integración Real AWS**: Conexión con AWS SDK.
- [x] **Dashboard Modular**: Grid configurable.
- [ ] **Multi-Cloud Support**: Añadir soporte para Azure/GCP.
- [ ] **Mobile App**: Versión PWA optimizada.
