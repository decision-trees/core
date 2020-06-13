import { AnswerValue } from './AnswerValue';
import { KeyValuePair } from './KeyValuePair';
import { Action } from './Actions';
import { EntityType } from './Entity';

export interface SessionHistoryEntry {
  action: Action;
  entityId?: string;
  answer?: AnswerValue;
  scope?: KeyValuePair[];
  nextId?: string;
  nextType?: EntityType;
  user: string;
  created: Date;
}
