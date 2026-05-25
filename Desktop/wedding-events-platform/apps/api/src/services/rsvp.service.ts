import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Rsvp } from '../types/domain';
import { dynamo, tableName } from '../repositories/dynamo';
import { listWeddingGuests, updateWeddingGuest } from './guests.service';

export async function getInviteByCode(inviteCode: string) {
  const res = await dynamo.send(new QueryCommand({
    TableName: tableName,
    IndexName: undefined,
    KeyConditionExpression: 'PK = :pk AND SK = :sk',
    ExpressionAttributeValues: { ':pk': `INVITE#${inviteCode}`, ':sk': 'RSVP' }
  }));
  const invite = res.Items?.[0];
  if (!invite) return null;
  const guests = await listWeddingGuests(invite.eventId);
  const guest = guests.find((g) => g.inviteCode === inviteCode);
  return { invite, guest };
}

export async function registerRsvp(inviteCode: string, input: Partial<Rsvp>) {
  const inviteData = await getInviteByCode(inviteCode);
  if (!inviteData?.guest) return null;
  const status = input.status || 'CONFIRMED';
  const rsvp: Rsvp = {
    PK: `INVITE#${inviteCode}`,
    SK: 'RSVP',
    inviteCode,
    eventId: inviteData.guest.eventId,
    guestId: inviteData.guest.guestId,
    status,
    confirmedAttendees: input.confirmedAttendees ?? inviteData.guest.passes,
    comments: input.comments,
    updatedAt: new Date().toISOString()
  };
  await dynamo.send(new PutCommand({ TableName: tableName, Item: rsvp }));
  await updateWeddingGuest(inviteData.guest.eventId, inviteData.guest.guestId, { status });
  return rsvp;
}
