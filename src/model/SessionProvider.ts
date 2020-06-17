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
  getSession(id: string): Promise<Session>;

  open(
    user: string,
    target: string,
    scope?: KeyValuePair[],
    parentId?: string
  ): Promise<Session>;
  changeStatus(
    id: string,
    status: SessionStatus,
    user: string
  ): Promise<Session>;
  mergeScope(id: string, scope: KeyValuePair[], user: string): Promise<Session>;

  currentHistoryEntry(id: string): Promise<SessionHistoryEntry>;
  getHistory(id: string): Promise<SessionHistoryEntry[]>;
  addEntry(id: string, entry: SessionHistoryEntry): Promise<void>;
}
