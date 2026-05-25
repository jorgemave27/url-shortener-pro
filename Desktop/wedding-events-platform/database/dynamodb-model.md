# WeddingEvents DynamoDB

- Partition Key: `PK`
- Sort Key: `SK`
- Billing: PAY_PER_REQUEST

Patrones principales:

- Obtener evento: `PK = EVENT#{eventId}`, `SK = METADATA`
- Listar invitados: `PK = EVENT#{eventId}`, `begins_with(SK, GUEST#)`
- Obtener invitación pública: `PK = INVITE#{inviteCode}`, `SK = RSVP`
