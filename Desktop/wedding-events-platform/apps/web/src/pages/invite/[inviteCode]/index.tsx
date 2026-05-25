import { GetStaticPaths, GetStaticProps } from 'next';
import { QRCodeCanvas } from 'qrcode.react';
import { RsvpForm } from '../../../components/RsvpForm';

export default function InvitePage({ inviteCode }: { inviteCode: string }) {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Invitación de boda</h1>
      <p>Código de invitación: <strong>{inviteCode}</strong></p>
      <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <h2>Diseño Canva / Imagen / PDF / Embed</h2>
        <p>Este bloque puede mostrar el diseño exportado desde Canva como imagen, PDF, enlace público o HTML embebido.</p>
      </section>
      <QRCodeCanvas value={inviteCode} />
      <h2>Confirmar asistencia</h2>
      <RsvpForm inviteCode={inviteCode} passes={2} />
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });
export const getStaticProps: GetStaticProps = async ({ params }) => ({ props: { inviteCode: params?.inviteCode || '' } });
