import { WeddingEvent } from '../types/domain';
import { newId } from '../utils/ids';
import * as repo from '../repositories/events.repository';

export async function createWeddingEvent(input: Partial<WeddingEvent>): Promise<WeddingEvent> {
  const eventId = input.eventId || newId();
  const now = new Date().toISOString();
  const event: WeddingEvent = {
    PK: `EVENT#${eventId}`,
    SK: 'METADATA',
    eventId,
    title: input.title || `${input.brideName || 'Novia'} & ${input.groomName || 'Novio'}`,
    date: input.date || now,
    place: input.place || '',
    brideName: input.brideName || '',
    groomName: input.groomName || '',
    publicInvitationUrl: input.publicInvitationUrl || `/invite/${eventId}`,
    eventCode: input.eventCode || eventId.toUpperCase(),
    canvaPublicUrl: input.canvaPublicUrl,
    canvaEmbedHtml: input.canvaEmbedHtml,
    canvaAssetUrl: input.canvaAssetUrl,
    createdAt: now,
    updatedAt: now
  };
  return repo.createEvent(event);
}

export const getWeddingEvent = repo.getEvent;
export const updateWeddingEvent = repo.updateEvent;
