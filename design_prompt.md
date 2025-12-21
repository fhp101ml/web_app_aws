# PROMPT — Página Legal moderna (SaaS cloud, con CSS propuesto)

___________________________________________________________________

## Rol

Actúa como un Senior Frontend Engineer + Product Designer especializado en SaaS enterprise y páginas legales modernas.

---

## Objetivo

Diseñar una página de Política de Privacidad / Protección de Datos con un estilo moderno, sobrio y tecnológico, alineado visualmente con una plataforma cloud premium como ExoCluster.

---

## Contexto visual deseado

- Dark mode profesional
- Estética cloud / security-first
- Inspiración: dashboards modernos (Vercel, AWS Console, Linear)
- Sensación de confianza, control y cumplimiento normativo

---

## Restricciones

- No se proporciona CSS previo
- Puedes proponer CSS completo o parcial
- Next.js compatible
- CSS puro (no Tailwind)

---

## Requisitos de diseño

### Hero legal elegante

- Título fuerte (“Política de Privacidad”)
- Subtítulo que refuerce confianza y seguridad
- Estilo institucional moderno

---

### Estructura tipo panel

- Secciones legales tratadas como bloques/paneles
- Separación visual clara
- Lectura escaneable

---

### Cards legales

- Cada apartado (Responsable, Datos, Derechos…) en su propio bloque
- Íconos sutiles (seguridad, datos, usuario)
- Hover ligero (sin parecer marketing)

---

### Tipografía y jerarquía

- Títulos compactos y profesionales
- Texto legal claro y aireado
- Evitar párrafos densos

---

### UX de confianza

- Enfatizar RGPD, LOPDGDD, soberanía del dato
- Derechos ARCO presentados como capacidades del usuario

___________________________________________________________________

# Floating Chat Widget — Especificación de Diseño

Necesito que crees un componente de Chatbot flotante ("Floating Chat Widget") para el chat de ia, elimna la configuración actual y la nueva hazla así.

Aquí tienes las especificaciones del diseño:

---

## 1. Estructura HTML (JSX)

- Un contenedor principal fijo (`fixed`) en la esquina inferior izquierda.
- Un botón de apertura (toggle) circular flotante fuera de la ventana del chat.
- Una ventana de chat (`chat-window`) que puede alternar su visibilidad (mostrar/ocultar).
- Dentro de la ventana:
  - `<header>`: Título "AI Assistant" y botón de cerrar "×".
  - Un área de mensajes (`messages container`) con scroll automático.
  - `<footer>`: Input de texto y botón de enviar "➤".

---

## 2. Estilos CSS (Requisitos exactos)

### Colores

- Primario (Botón toggle, Header, Mensajes usuario): `#2271b1` (Azul WordPress)
- Fondo mensajes bot: `#e5e5ea` (Gris claro ios-style)
- Fondo contenedor mensajes: `#f6f6f6`
- Texto en primario: `#fff`

---

### Dimensiones y Posición

- Botón Toggle:
  - 56x56px
  - border-radius: 50%
  - bottom: 20px
  - right: 20px
- Ventana Chat:
  - Ancho 360px
  - Alto 500px
  - bottom: 70px (encima del toggle)
  - right: 0
- Sombra:
  - `box-shadow: 0 10px 30px rgba(0,0,0,.2);`
- Bordes:
  - border-radius: 10px en la ventana
  - 8px en las burbujas de mensaje

---

### Comportamiento

- Burbujas de usuario (`.msg.user`):
  - Alineadas a la derecha
  - Fondo azul
- Burbujas de bot (`.msg.bot`):
  - Alineadas a la izquierda
  - Fondo gris
- El contenedor de mensajes debe tener:
  - `flex: 1`
  - `overflow-y: auto`
