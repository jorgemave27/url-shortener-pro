export type InvitationStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

export interface WeddingEvent {
  PK: string;
  SK: 'METADATA';
  eventId: string;
  title: string;
  date: string;
  place: string;
  brideName: string;
  groomName: string;
  publicInvitationUrl: string;
  eventCode: string;
  canvaPublicUrl?: string;
  canvaEmbedHtml?: string;
  canvaAssetUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  PK: string;
  SK: string;
  guestId: string;
  eventId: string;
  name: string;
  phone?: string;
  email?: string;
  passes: number;
  table?: string;
  status: InvitationStatus;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rsvp {
  PK: string;
  SK: 'RSVP';
  inviteCode: string;
  eventId: string;
  guestId: string;
  status: InvitationStatus;
  confirmedAttendees: number;
  comments?: string;
  updatedAt: string;
}
