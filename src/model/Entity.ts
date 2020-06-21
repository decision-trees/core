import { Property } from './Property';

export enum EntityType {
  Question = 'question',
  Solution = 'solution',
}

export interface Entity {
  id: string;
  type: EntityType;
  properties?: Property[];
}
