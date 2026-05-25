import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Guest } from '../types/domain';
import { dynamo, tableName } from './dynamo';

export async function createGuest(guest: Guest): Promise<Guest> {
  await dynamo.send(new PutCommand({ TableName: tableName, Item: guest }));
  await dynamo.send(new PutCommand({
    TableName: tableName,
    Item: { PK: `INVITE#${guest.inviteCode}`, SK: 'RSVP', eventId: guest.eventId, guestId: guest.guestId, status: guest.status }
  }));
  return guest;
}

export async function listGuests(eventId: string): Promise<Guest[]> {
  const res = await dynamo.send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { ':pk': `EVENT#${eventId}`, ':sk': 'GUEST#' }
  }));
  return (res.Items || []) as Guest[];
}

export async function getGuest(eventId: string, guestId: string): Promise<Guest | null> {
  const res = await dynamo.send(new GetCommand({ TableName: tableName, Key: { PK: `EVENT#${eventId}`, SK: `GUEST#${guestId}` } }));
  return (res.Item as Guest) || null;
}

export async function updateGuest(eventId: string, guestId: string, patch: Partial<Guest>): Promise<Guest> {
  const updatedAt = new Date().toISOString();
  const entries = Object.entries({ ...patch, updatedAt }).filter(([, v]) => v !== undefined);
  const names = Object.fromEntries(entries.map(([k]) => [`#${k}`, k]));
  const values = Object.fromEntries(entries.map(([k, v]) => [`:${k}`, v]));
  const res = await dynamo.send(new UpdateCommand({
    TableName: tableName,
    Key: { PK: `EVENT#${eventId}`, SK: `GUEST#${guestId}` },
    UpdateExpression: `SET ${entries.map(([k]) => `#${k} = :${k}`).join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  }));
  return res.Attributes as Guest;
}

export async function deleteGuest(eventId: string, guestId: string): Promise<void> {
  await dynamo.send(new DeleteCommand({ TableName: tableName, Key: { PK: `EVENT#${eventId}`, SK: `GUEST#${guestId}` } }));
}
