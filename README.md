
# ExoCluster - Cloud Management Platform (v0.1.0)

Bienvenido a la versión inicial de **ExoCluster**, una plataforma moderna para la gestión centralizada de recursos en la nube. Esta versión v.0 establece los cimientos de la arquitectura, la seguridad y la experiencia de usuario.

## 🚀 Funcionalidades Actuales

### 1. Autenticación y Seguridad
- **Login Seguro**: Sistema robusto basado en `NextAuth.js` con credenciales (Email/Password).
- **Protección de Rutas**: Middleware que protege `/dashboard` y sub-rutas.
- **Roles de Usuario**: Distinción entre `ADMIN` y `USER`.
- **Registro de Usuarios**: Formulario de registro público (pendientes de aprobación por defecto).
- **Gestión de Sesión**: Cierre de sesión seguro con limpieza de estado.

### 2. Gestión de Usuarios (Admin)
- **Panel de Administración**: Vista tabular estilizada de todos los usuarios registrados.
- **Aprobación de Cuentas**: Los administradores pueden aprobar o rechazar nuevos registros.
- **Eliminación**: Capacidad para eliminar usuarios del sistema.

### 3. Perfil de Usuario Avanzado
- **Gestión de Identidad**: Actualización de nombre y contraseña.
- **Personalización**: Preferencia de **Tema (Claro/Oscuro)** persistente en base de datos.
- **UX Mejorada**:
  - Iconografía premium "outline".
  - Layout responsivo con Glassmorphism.
  - Feedback visual inmediato.

### 4. Interfaz de Usuario (UI/UX)
- **Diseño Premium**: Estética moderna con Glassmorphism, desenfoques y sombras sutiles.
- **Sistema de Temas**: Soporte nativo para modo oscuro/claro, sincronizado con la sesión.
- **Navegación Intuitiva**: Header consolidado con menú de usuario desplegable.

### 5. Accesibilidad y Diseño Responsive
- **Diseño Adaptativo**: Experiencia optimizada para móviles (menús hamburguesa, layouts reordenables).
- **Accesibilidad**: Cumplimiento WCAG 2.1 AA (contrastes, navegación por teclado, aria-labels).
- **Animaciones Respetuosas**: Detección de `prefers-reduced-motion`.

### 6. Rendimiento y Seguridad
- **Optimización**: Carga diferida de fuentes y eliminación de logs en producción.
- **Seguridad HTTP**: Headers de seguridad (CSP, HSTS, X-Frame-Options) configurados.
- **Rate Limiting**: Protección contra ataques de fuerza bruta en API Routes (Token Bucket).

---

## �️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite (Dev) / PostgreSQL (Prod ready)
- **ORM**: Prisma
- **Autenticación**: NextAuth.js v4
- **Estilos**: Raw CSS Modules + Variables CSS (Sin Frameworks CSS pesados)

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo desde cero.

### 1. Requisitos Previos
- Node.js 18+
- NPM

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente ejemplo:

```bash
# .env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-clave-secreta-generada-aleatoriamente"

# Credenciales AWS (Opcional por ahora)
AWS_ACCESS_KEY_ID="tu-key"
AWS_SECRET_ACCESS_KEY="tu-secret"
AWS_REGION="us-east-1"
```

> **IMPORTANTE**: No incluyas `NEXTAUTH_URL` si quieres que el puerto sea dinámico. NextAuth lo detectará automáticamente.

### 4. Inicialización de Base de Datos
Genera el cliente de Prisma y empuja el esquema a la base de datos local (SQLite):

```bash
npx prisma generate
npx prisma db push
```

### 5. Crear Super Admin
Para entrar al sistema por primera vez, necesitas crear un usuario administrador. Ejecuta el script incluido:

```bash
node scripts/create-admin.js
```
Esto creará un usuario con credenciales por defecto (revisa el script o la salida de la consola para verlas).

---

## ▶️ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el siguiente puerto libre).

---

## 📝 Notas de la Versión
- **v0.1.0**: Release inicial con Core, Auth, Perfiles y Temas.

---

## 🚧 Roadmap y Tareas Pendientes

### Infraestructura y Escalabilidad
- [ ] **Migración a Base de Datos Externa**:
  - Configuración preparada para PostgreSQL/MySQL (Production Ready).
  - Desarrollo de scripts de migración de datos desde SQLite local.
  - Soporte para conexión a bases de datos en servicios cloud externos.

### Cumplimiento Legal (RGPD / LSSI)
Es prioritario asegurar el estricto cumplimiento de la normativa de protección de datos y servicios de la sociedad de la información:
- [ ] **Consentimiento y Transparencia**:
  - Implementación de checkbox de consentimiento explícito en formularios de registro.
  - Creación de páginas dedicadas para **Política de Privacidad** y **Aviso Legal**.
  - Implementación de **Banner de Cookies** con paneles de configuración granular.
- [ ] **Derechos del Usuario (ARCO)**:
  - **Portabilidad**: Botón "Exportar mis datos" en el perfil de usuario (formato JSON/CSV).
  - **Derecho al Olvido**: Funcionalidad de "Eliminar cuenta" con borrado seguro de datos personales.

### Otros Requisitos Transversales
- [x] **Accesibilidad**: Auditoría completa WCAG 2.1 AA (colores, navegación por teclado, aria-labels).
- [x] **Seguridad**:
  - Implementación de cabeceras de seguridad HTTP (Helmet, CSP).
  - Rate Limiting para protección contra ataques de fuerza bruta.
  - Logs de auditoría para acciones críticas.
