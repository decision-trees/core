import { KeyValuePair } from './KeyValuePair';
import { SessionStatus } from './SessionProvider';

export interface Session {
  parentId: string;
  id: string;
  target: string;
  status: SessionStatus;
  scope: KeyValuePair[];
  creator: string;
  created: Date;
}
