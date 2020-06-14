import { Property } from './Property';

export enum EntityType {
  Question,
  Solution,
}

export interface Entity {
  id: string;
  type: EntityType;
  properties: Property[];
}
