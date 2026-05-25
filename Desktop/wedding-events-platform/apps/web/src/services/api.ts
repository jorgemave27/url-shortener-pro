import { API_URL } from '../config/env';

export async function getInvite(inviteCode: string) {
  const res = await fetch(`${API_URL}/invite/${inviteCode}`);
  if (!res.ok) throw new Error('Invitación no encontrada');
  return res.json();
}

export async function sendRsvp(inviteCode: string, data: { status: string; confirmedAttendees: number; comments?: string }) {
  const res = await fetch(`${API_URL}/invite/${inviteCode}/rsvp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('No se pudo registrar RSVP');
  return res.json();
}
