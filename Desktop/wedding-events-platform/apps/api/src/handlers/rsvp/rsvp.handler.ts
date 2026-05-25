import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { getInviteByCode, registerRsvp } from '../../services/rsvp.service';
import { json, parseBody } from '../../utils/http';

export async function getInviteHandler(event: APIGatewayProxyEventV2) {
  const inviteCode = event.pathParameters?.inviteCode || '';
  const invite = await getInviteByCode(inviteCode);
  return invite ? json(200, invite) : json(404, { message: 'Invite not found' });
}

export async function registerRsvpHandler(event: APIGatewayProxyEventV2) {
  const inviteCode = event.pathParameters?.inviteCode || '';
  const rsvp = await registerRsvp(inviteCode, parseBody(event.body));
  return rsvp ? json(200, rsvp) : json(404, { message: 'Invite not found' });
}
