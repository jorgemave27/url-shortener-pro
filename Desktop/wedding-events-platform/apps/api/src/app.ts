import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createEventHandler, getEventHandler, updateEventHandler } from './handlers/events/events.handler';
import { createGuestHandler, deleteGuestHandler, listGuestsHandler, updateGuestHandler } from './handlers/guests/guests.handler';
import { getInviteHandler, registerRsvpHandler } from './handlers/rsvp/rsvp.handler';
import { exportHandler, summaryHandler } from './handlers/admin/admin.handler';
import { json } from './utils/http';

type Route = { method: string; pattern: RegExp; keys: string[]; action: (event: APIGatewayProxyEventV2) => Promise<any> };

const routes: Route[] = [
  { method: 'POST', pattern: /^\/events$/, keys: [], action: createEventHandler },
  { method: 'GET', pattern: /^\/events\/([^/]+)$/, keys: ['eventId'], action: getEventHandler },
  { method: 'PUT', pattern: /^\/events\/([^/]+)$/, keys: ['eventId'], action: updateEventHandler },
  { method: 'POST', pattern: /^\/events\/([^/]+)\/guests$/, keys: ['eventId'], action: createGuestHandler },
  { method: 'GET', pattern: /^\/events\/([^/]+)\/guests$/, keys: ['eventId'], action: listGuestsHandler },
  { method: 'PUT', pattern: /^\/events\/([^/]+)\/guests\/([^/]+)$/, keys: ['eventId', 'guestId'], action: updateGuestHandler },
  { method: 'DELETE', pattern: /^\/events\/([^/]+)\/guests\/([^/]+)$/, keys: ['eventId', 'guestId'], action: deleteGuestHandler },
  { method: 'GET', pattern: /^\/invite\/([^/]+)$/, keys: ['inviteCode'], action: getInviteHandler },
  { method: 'POST', pattern: /^\/invite\/([^/]+)\/rsvp$/, keys: ['inviteCode'], action: registerRsvpHandler },
  { method: 'GET', pattern: /^\/events\/([^/]+)\/summary$/, keys: ['eventId'], action: summaryHandler },
  { method: 'GET', pattern: /^\/events\/([^/]+)\/export$/, keys: ['eventId'], action: exportHandler }
];

export async function handler(event: APIGatewayProxyEventV2) {
  if (event.requestContext.http.method === 'OPTIONS') return json(204, null);
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const route = routes.find((r) => r.method === method && r.pattern.test(path));
  if (!route) return json(404, { message: 'Route not found', method, path });
  const match = path.match(route.pattern);
  event.pathParameters = Object.fromEntries(route.keys.map((key, index) => [key, match?.[index + 1] || '']));
  try {
    return await route.action(event);
  } catch (error) {
    console.error(error);
    return json(500, { message: 'Internal server error' });
  }
}
