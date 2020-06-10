import { Entity } from './Entity';
import { AnswerValue } from './AnswerValue';

export interface EntityProvider {
  getEntity(id: string): Entity | undefined;
}
