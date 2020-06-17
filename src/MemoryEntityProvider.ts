import { EntityProvider } from './model/EntityProvider';
import { Entity, EntityType } from './model';
import { DecisionTreeError, ErrorCode } from './DecisionTreeError';
import { EntityListResult } from './model/EntityListResult';

export class MemoryEntityProvider implements EntityProvider {
  constructor(private entities: Entity[]) {}
  create(type: EntityType): Promise<Entity> {
    const result = { id: this.entities.length.toString(), type };
    this.entities.push(result);
    return Promise.resolve(result);
  }

  read(id: string): Promise<Entity | undefined> {
    return Promise.resolve(this.entities.find((entity) => entity.id === id));
  }

  update(id: string, entity: Entity): Promise<Entity> {
    const index = this.entities.findIndex((entity) => entity.id === id);
    if (index < 0) {
      throw new DecisionTreeError(
        ErrorCode.NotFound,
        'No entity found for the given Id.'
      );
    }
    this.entities[index] = { ...entity, id };
    return Promise.resolve(this.entities[index]);
  }

  delete(id: string): Promise<void> {
    const index = this.entities.findIndex((entity) => entity.id === id);
    if (index < 0) {
      throw new DecisionTreeError(
        ErrorCode.NotFound,
        'No entity found for the given Id.'
      );
    }
    this.entities[index].id = `${this.entities[index].id}.deleted`;
    (this.entities[index] as any).deleted = true;
    return Promise.resolve(void 0);
  }

  list(skip: number = 0, limit: number = 10): Promise<EntityListResult> {
    const result: EntityListResult = {
      entities: [],
      count: this.entities.length,
      skip,
      limit,
    };
    if (skip < this.entities.length) {
      for (
        let i = skip, n = this.entities.length, m = i + limit;
        i < n && i < m;
        i++
      ) {
        result.entities.push(this.entities[i]);
      }
    }
    return Promise.resolve(result);
  }
}
