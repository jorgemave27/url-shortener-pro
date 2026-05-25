import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createWeddingEvent, getWeddingEvent, updateWeddingEvent } from '../../services/events.service';
import { json, parseBody } from '../../utils/http';

export async function createEventHandler(event: APIGatewayProxyEventV2) {
  const created = await createWeddingEvent(parseBody(event.body));
  return json(201, created);
}

export async function getEventHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const item = await getWeddingEvent(eventId);
  return item ? json(200, item) : json(404, { message: 'Event not found' });
}

export async function updateEventHandler(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.eventId || '';
  const updated = await updateWeddingEvent(eventId, parseBody(event.body));
  return json(200, updated);
}
