import { Entity } from './Entity';

export interface EntityListResult {
  count: number;
  entities: Entity[];
  skip: number;
  limit: number;
}
