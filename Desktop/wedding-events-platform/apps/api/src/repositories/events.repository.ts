import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { WeddingEvent } from '../types/domain';
import { dynamo, tableName } from './dynamo';

export async function createEvent(event: WeddingEvent): Promise<WeddingEvent> {
  await dynamo.send(new PutCommand({ TableName: tableName, Item: event }));
  return event;
}

export async function getEvent(eventId: string): Promise<WeddingEvent | null> {
  const res = await dynamo.send(new GetCommand({ TableName: tableName, Key: { PK: `EVENT#${eventId}`, SK: 'METADATA' } }));
  return (res.Item as WeddingEvent) || null;
}

export async function updateEvent(eventId: string, patch: Partial<WeddingEvent>): Promise<WeddingEvent> {
  const updatedAt = new Date().toISOString();
  const entries = Object.entries({ ...patch, updatedAt }).filter(([, v]) => v !== undefined);
  const names = Object.fromEntries(entries.map(([k]) => [`#${k}`, k]));
  const values = Object.fromEntries(entries.map(([k, v]) => [`:${k}`, v]));
  const updateExpression = `SET ${entries.map(([k]) => `#${k} = :${k}`).join(', ')}`;
  const res = await dynamo.send(new UpdateCommand({
    TableName: tableName,
    Key: { PK: `EVENT#${eventId}`, SK: 'METADATA' },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  }));
  return res.Attributes as WeddingEvent;
}
