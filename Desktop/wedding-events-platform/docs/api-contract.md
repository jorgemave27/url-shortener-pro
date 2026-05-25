# API Contract

## Eventos

### POST /events
Crea una boda.

```json
{
  "title": "Boda Ana y Luis",
  "date": "2026-10-10",
  "place": "Hacienda San Miguel",
  "brideName": "Ana",
  "groomName": "Luis",
  "publicInvitationUrl": "https://example.com/invite/ABC123",
  "eventCode": "EVENT2026",
  "canvaPublicUrl": "https://www.canva.com/...",
  "canvaEmbedHtml": "<iframe ...></iframe>",
  "canvaAssetUrl": "https://cdn.example.com/invite.png"
}
```

### GET /events/{eventId}
Obtiene metadata del evento.

### PUT /events/{eventId}
Actualiza metadata del evento.

## Invitados

### POST /events/{eventId}/guests
```json
{
  "PK": "EVENT#123",
  "SK": "GUEST#001",
  "guestId": "001",
  "name": "Juan Pérez",
  "phone": "5512345678",
  "email": "juan@email.com",
  "passes": 2,
  "table": "Mesa 5",
  "status": "PENDING",
  "inviteCode": "ABC123"
}
```

### GET /events/{eventId}/guests
Lista invitados.

### PUT /events/{eventId}/guests/{guestId}
Actualiza invitado.

### DELETE /events/{eventId}/guests/{guestId}
Elimina invitado.

## Invitación pública

### GET /invite/{inviteCode}
Obtiene datos públicos de invitación.

### POST /invite/{inviteCode}/rsvp
```json
{
  "status": "CONFIRMED",
  "confirmedAttendees": 2,
  "comments": "Llegaremos después de la ceremonia"
}
```

## Administración

### GET /events/{eventId}/summary
Devuelve confirmados, pendientes, declinados y pases.

### GET /events/{eventId}/export
Exporta CSV.
