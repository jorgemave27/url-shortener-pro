# Canva Integration

## Flujo

1. Diseñador crea invitación en Canva.
2. Dev exporta diseño como imagen, PDF, enlace público o embed HTML.
3. Web muestra el diseño.
4. Botón “Confirmar asistencia”.
5. Usuario entra con `inviteCode`.
6. API registra RSVP.
7. Admin ve confirmaciones.

## Opciones soportadas

- `canvaPublicUrl`: enlace público de Canva.
- `canvaEmbedHtml`: iframe o HTML embebido.
- `canvaAssetUrl`: imagen/PDF exportado y servido desde S3 + CloudFront.

## Seguridad

El control de acceso público se realiza con `inviteCode`. Para dashboard privado se usa Cognito.
