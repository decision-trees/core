import { MemoryEntityProvider } from './MemoryEntityProvider';
import { EntityProvider, EntityType } from './model';

describe('MemoryEntityProvider', () => {
  let provider: EntityProvider;
  const entities = [
    { id: 'a', type: EntityType.Question },
    { id: 'b', type: EntityType.Question },
    { id: 'c', type: EntityType.Question },
  ];

  beforeAll(() => {
    provider = new MemoryEntityProvider(entities);
  });

  it('should find entity by Id a', () => {
    expect(provider.getEntity('a')).toBe(entities[0]);
  });
  it('should find entity by Id b', () => {
    expect(provider.getEntity('b')).toBe(entities[1]);
  });
  it('should find entity by Id c', () => {
    expect(provider.getEntity('c')).toBe(entities[2]);
  });
  it('should not find entity by Id d', () => {
    expect(provider.getEntity('d')).toBeUndefined();
  });
});
