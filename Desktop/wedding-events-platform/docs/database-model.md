# Database Model

Tabla DynamoDB: `WeddingEvents`

| PK | SK | Tipo |
|---|---|---|
| EVENT#123 | METADATA | Evento |
| EVENT#123 | GUEST#001 | Invitado |
| EVENT#123 | GUEST#002 | Invitado |
| INVITE#ABC123 | RSVP | RSVP / acceso público |

## Entidad evento

```json
{
  "PK": "EVENT#123",
  "SK": "METADATA",
  "eventId": "123",
  "date": "2026-10-10",
  "place": "Hacienda San Miguel",
  "brideName": "Ana",
  "groomName": "Luis",
  "publicInvitationUrl": "https://example.com/invite/ABC123",
  "eventCode": "EVENT2026"
}
```

## Entidad invitado

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
