import { AnswerValue } from './AnswerValue';
import { KeyValuePair } from './KeyValuePair';
import { Entity } from './Entity';

export interface DecisionTreeEvaluator {
  next(id: string, answer: AnswerValue, scope: KeyValuePair[]): Entity;
}
