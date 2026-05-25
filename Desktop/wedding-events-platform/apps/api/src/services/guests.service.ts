import { Guest } from '../types/domain';
import { newId, newInviteCode } from '../utils/ids';
import * as repo from '../repositories/guests.repository';

export async function createWeddingGuest(eventId: string, input: Partial<Guest>): Promise<Guest> {
  const guestId = input.guestId || newId();
  const now = new Date().toISOString();
  const guest: Guest = {
    PK: `EVENT#${eventId}`,
    SK: `GUEST#${guestId}`,
    guestId,
    eventId,
    name: input.name || '',
    phone: input.phone,
    email: input.email,
    passes: input.passes || 1,
    table: input.table,
    status: input.status || 'PENDING',
    inviteCode: input.inviteCode || newInviteCode(),
    createdAt: now,
    updatedAt: now
  };
  return repo.createGuest(guest);
}

export const listWeddingGuests = repo.listGuests;
export const getWeddingGuest = repo.getGuest;
export const updateWeddingGuest = repo.updateGuest;
export const deleteWeddingGuest = repo.deleteGuest;
