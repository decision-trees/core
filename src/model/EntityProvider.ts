import { Entity, EntityType } from './Entity';

export interface EntityProvider {
  create(type: EntityType): Entity;
  read(id: string): Entity | undefined;
  update(id: string, entity: Entity): Entity;
  delete(id: string): void;

  list(skip: number, limit: number): Entity[];
}
