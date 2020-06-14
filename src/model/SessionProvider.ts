import { Session } from './Session';
import { SessionHistoryEntry } from './SessionHistoryEntry';
import { KeyValuePair } from './KeyValuePair';

export enum SessionStatus {
  Opened,
  Suspended,
  Resumed,
  Closed,
}

export interface SessionProvider {
  getSession(id: string): Session;

  open(
    user: string,
    target: string,
    scope?: KeyValuePair[],
    parentId?: string
  ): Session;
  changeStatus(id: string, status: SessionStatus, user: string): Session;
  mergeScope(id: string, scope: KeyValuePair[], user: string): Session;

  currentHistoryEntry(id: string): SessionHistoryEntry;
  getHistory(id: string): SessionHistoryEntry[];
  addEntry(id: string, entry: SessionHistoryEntry): void;
}
