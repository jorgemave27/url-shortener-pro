import { randomUUID } from 'crypto';

export function newId(prefix = ''): string {
  return `${prefix}${randomUUID().split('-')[0]}`;
}

export function newInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
