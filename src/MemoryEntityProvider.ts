import { EntityProvider } from './model/EntityProvider';
import { Entity } from './model';

export class MemoryEntityProvider implements EntityProvider {
  constructor(private entities: Entity[]) {}

  getEntity(id: string): Entity | undefined {
    const result = this.entities.find((entity) => entity.id === id);
    return result;
  }
}
