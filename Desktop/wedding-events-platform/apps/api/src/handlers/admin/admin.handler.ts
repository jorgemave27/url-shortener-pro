import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { listWeddingGuests } from '../../services/guests.service';
import { json } from '../../utils/http';

export async function summaryHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const guests = await listWeddingGuests(eventId);
  return json(200, {
    eventId,
    totalGuests: guests.length,
    totalPasses: guests.reduce((sum, g) => sum + g.passes, 0),
    confirmed: guests.filter((g) => g.status === 'CONFIRMED').length,
    declined: guests.filter((g) => g.status === 'DECLINED').length,
    pending: guests.filter((g) => g.status === 'PENDING').length
  });
}

export async function exportHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const guests = await listWeddingGuests(eventId);
  const header = ['guestId', 'name', 'phone', 'email', 'passes', 'table', 'status', 'inviteCode'];
  const rows = guests.map((g) => [g.guestId, g.name, g.phone || '', g.email || '', g.passes, g.table || '', g.status, g.inviteCode]);
  const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  return { statusCode: 200, headers: { 'content-type': 'text/csv', 'content-disposition': `attachment; filename="event-${eventId}-guests.csv"` }, body: csv };
}
