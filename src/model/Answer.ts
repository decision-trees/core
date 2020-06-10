import { Localizable } from './Localizable';
import { AnswerValue } from './AnswerValue';

export interface Answer {
  text: Localizable[];
  value: AnswerValue;
  targetId: string;
}
