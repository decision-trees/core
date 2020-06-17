import { Entity, EntityType } from './Entity';
import { EntityListResult } from './EntityListResult';

export interface EntityProvider {
  create(type: EntityType): Promise<Entity>;
  read(id: string): Promise<Entity | undefined>;
  update(id: string, entity: Entity): Promise<Entity>;
  delete(id: string): Promise<void>;

  list(skip: number, limit: number): Promise<EntityListResult>;
}
