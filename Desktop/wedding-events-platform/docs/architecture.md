# Arquitectura

La plataforma usa arquitectura serverless en AWS.

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

## Componentes

- API Gateway: expone endpoints HTTP.
- Lambda: backend Node.js + TypeScript.
- DynamoDB: almacena eventos, invitados y RSVP.
- S3: hospeda frontend estático y assets exportados de Canva.
- CloudFront: CDN para invitaciones públicas.
- Cognito: login del administrador.
- SES: envío de correos.
- Route53: dominio personalizado.
- IAM: permisos mínimos necesarios.
