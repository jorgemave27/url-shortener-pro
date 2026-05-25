import { useState } from 'react';
import { sendRsvp } from '../services/api';

export function RsvpForm({ inviteCode, passes }: { inviteCode: string; passes: number }) {
  const [status, setStatus] = useState('CONFIRMED');
  const [confirmedAttendees, setConfirmedAttendees] = useState(passes);
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await sendRsvp(inviteCode, { status, confirmedAttendees, comments });
    setMessage('Respuesta registrada correctamente.');
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <label>Respuesta
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="CONFIRMED">Confirmado</option>
          <option value="DECLINED">No asistirá</option>
          <option value="PENDING">Pendiente</option>
        </select>
      </label>
      <label>Asistentes confirmados
        <input type="number" min={0} max={passes} value={confirmedAttendees} onChange={(e) => setConfirmedAttendees(Number(e.target.value))} />
      </label>
      <label>Comentarios
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
      </label>
      <button type="submit">Confirmar asistencia</button>
      {message && <p>{message}</p>}
    </form>
  );
}
