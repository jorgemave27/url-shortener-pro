# Wedding Events Platform

Plataforma serverless para crear bodas, administrar invitados, publicar invitaciones con diseño de Canva/Next.js, registrar RSVP y exportar confirmaciones.

## Stack técnico

- Frontend: Next.js
- Backend: Node.js + TypeScript + AWS Lambda
- Infraestructura: Terraform
- Base de datos: DynamoDB
- Auth admin: Cognito
- Emails: SES
- Hosting: S3 + CloudFront
- CI/CD: GitHub Actions

## Funcionalidades MVP

### Eventos
- Crear boda
- Fecha, lugar, novios
- URL pública de invitación
- Código único del evento

### Invitados
- Nombre
- Teléfono
- Email
- Número de pases
- Mesa asignada
- Estado de invitación

### RSVP
- Confirmado
- No asistirá
- Pendiente
- Número de asistentes confirmados
- Comentarios

### Invitaciones
- Link personalizado
- Diseño Canva embebido o exportado
- Código QR
- Control de acceso por inviteCode

### Administración
- Dashboard privado
- Lista de invitados
- Confirmaciones
- Exportar CSV

## Endpoints API

```txt
POST   /events
GET    /events/{eventId}
PUT    /events/{eventId}

POST   /events/{eventId}/guests
GET    /events/{eventId}/guests
PUT    /events/{eventId}/guests/{guestId}
DELETE /events/{eventId}/guests/{guestId}

GET    /invite/{inviteCode}
POST   /invite/{inviteCode}/rsvp

GET    /events/{eventId}/summary
GET    /events/{eventId}/export
```

## Flujo técnico

```txt
Usuario
  ↓
Sitio web / invitación Canva o Next.js
  ↓
CloudFront + S3
  ↓
API Gateway
  ↓
Lambda API
  ↓
DynamoDB
  ↓
SES / WhatsApp externo / Email
```

## Instalación local API

```bash
cd apps/api
npm install
npm run dev
```

## Instalación local web

```bash
cd apps/web
npm install
npm run dev
```

## Deploy infraestructura

```bash
cd infra/terraform/envs/dev
terraform init
terraform plan
terraform apply
```

## Modelo DynamoDB

Tabla: `WeddingEvents`

| PK | SK | Tipo |
|---|---|---|
| EVENT#123 | METADATA | Evento |
| EVENT#123 | GUEST#001 | Invitado |
| EVENT#123 | GUEST#002 | Invitado |
| INVITE#ABC123 | RSVP | RSVP / acceso público |

