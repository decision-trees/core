import { EntityProvider } from './model/EntityProvider';
import { Entity, EntityType } from './model';
import { DecisionTreeError, ErrorCode } from './DecisionTreeError';

export class MemoryEntityProvider implements EntityProvider {
  constructor(private entities: Entity[]) {}
  create(type: EntityType): Entity {
    const result = { id: this.entities.length.toString(), type };
    this.entities.push(result);
    return result;
  }
  read(id: string): Entity | undefined {
    return this.entities.find((entity) => entity.id === id);
  }
  update(id: string, entity: Entity): Entity {
    const index = this.entities.findIndex((entity) => entity.id === id);
    if (index < 0) {
      throw new DecisionTreeError(
        ErrorCode.NotFound,
        'No entity found for the given Id.'
      );
    }
    this.entities[index] = { ...entity, id };
    return this.entities[index];
  }
  delete(id: string): void {
    const index = this.entities.findIndex((entity) => entity.id === id);
    if (index < 0) {
      throw new DecisionTreeError(
        ErrorCode.NotFound,
        'No entity found for the given Id.'
      );
    }
    this.entities[index].id = `${this.entities[index].id}.deleted`;
    (this.entities[index] as any).deleted = true;
  }
  list(skip: number = 0, limit: number = 10): Entity[] {
    const result: Entity[] = [];
    if (skip < this.entities.length) {
      for (
        let i = skip, n = this.entities.length, m = i + limit;
        i < n && i < m;
        i++
      ) {
        result.push(this.entities[i]);
      }
    }
    return result;
  }
}
