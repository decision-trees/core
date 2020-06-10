import { Localizable } from './Localizable';
import { Entity } from './Entity';
import { Answer } from './Answer';

export interface Question extends Entity {
  text: Localizable[];
  answers: Answer[];
}
