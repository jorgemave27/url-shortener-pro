import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createWeddingGuest, deleteWeddingGuest, listWeddingGuests, updateWeddingGuest } from '../../services/guests.service';
import { json, parseBody } from '../../utils/http';

export async function createGuestHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const created = await createWeddingGuest(eventId, parseBody(event.body));
  return json(201, created);
}

export async function listGuestsHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const guests = await listWeddingGuests(eventId);
  return json(200, guests);
}

export async function updateGuestHandler(event: APIGatewayProxyEventV2) {
  const { eventId = '', guestId = '' } = event.pathParameters || {};
  const updated = await updateWeddingGuest(eventId, guestId, parseBody(event.body));
  return json(200, updated);
}

export async function deleteGuestHandler(event: APIGatewayProxyEventV2) {
  const { eventId = '', guestId = '' } = event.pathParameters || {};
  await deleteWeddingGuest(eventId, guestId);
  return json(204, null);
}
