# Manual de Referencia: Prisma ORM

Este documento describe el uso de Prisma para la gestión de la base de datos y migraciones.

## Comandos Principales

| Comando | Descripción | Contexto |
| :--- | :--- | :--- |
| `npx prisma generate` | Genera el Cliente de Prisma (`@prisma/client`) basado en el esquema. Debe ejecutarse tras cambios en `schema.prisma`. | Desarrollo/Build |
| `npx prisma db push` | Sincroniza el esquema de Prisma con la base de datos sin crear archivos de migración (ideal para prototipado). | Desarrollo |
| `npx prisma migrate dev` | Crea una nueva migración SQL y la aplica a la BD. Pide nombre para la migración. | Cambios de esquema |
| `npx prisma migrate deploy` | Aplica migraciones pendientes en producción. No resetea la BD. | Producción/CI-CD |
| `npx prisma studio` | Abre una interfaz gráfica web para ver y editar los datos de la base de datos. | Gestión de datos |

## Flujo de Trabajo Común

### 1. Modificar el Modelo de Datos
Edita el archivo `prisma/schema.prisma` para añadir modelos o campos.
```prisma
model NuevoRecurso {
  id    String @id @default(cuid())
  name  String
}
```

### 2. Aplicar Cambios (Desarrollo)
```bash
npx prisma migrate dev --name init_nuevo_recurso
```
Esto crea un archivo SQL en `prisma/migrations` y actualiza tu base de datos local.

### 3. Generar Cliente
Si `migrate dev` no lo hace automáticamente, o si clonaste el repo:
```bash
npx prisma generate
```

### 4. Consultar Datos (Studio)
Para verificar datos rápidamente sin SQL:
```bash
npx prisma studio
```

## Solución de Problemas

- **Error de conexión**: Verifica la variable `DATABASE_URL` en el archivo `.env`.
- **Tipos desactualizados**: Si TypeScript se queja de campos que ya existen en la BD, ejecuta `npx prisma generate` y reinicia el servidor de TS (o VS Code).
- **Resetear Base de Datos**: `npx prisma migrate reset` borrará todos los datos, aplicará todas las migraciones desde cero y ejecutará los seeds.

---
**Recurso Oficial:** [Documentación de Prisma](https://www.prisma.io/docs)
