import { MemoryEntityProvider } from './MemoryEntityProvider';
import { EntityProvider, EntityType, Question } from './model';

describe('MemoryEntityProvider', () => {
  let provider: EntityProvider;
  const entities = [
    { id: 'a', type: EntityType.Question },
    { id: 'b', type: EntityType.Question },
    { id: 'c', type: EntityType.Question },
    { id: 'e', type: EntityType.Question },
  ];

  beforeAll(() => {
    provider = new MemoryEntityProvider(entities);
  });

  it('should find entity by Id a', () => {
    expect(provider.read('a')).toBe(entities[0]);
  });
  it('should find entity by Id b', () => {
    expect(provider.read('b')).toBe(entities[1]);
  });
  it('should find entity by Id c', () => {
    expect(provider.read('c')).toBe(entities[2]);
  });
  it('should not find entity by Id d', () => {
    expect(provider.read('d')).toBeUndefined();
  });

  it('should create entity with Id 4', () => {
    const entity = provider.create(EntityType.Question);
    expect(entity.id).toBe('4');
    expect(entity.type).toBe(EntityType.Question);
  });
  it('should update entity with Id 4 to Question with text', () => {
    const question: Question = provider.create(EntityType.Question) as Question;
    question.text = [{ locale: 'de', value: 'Test text' }];
    let entity = provider.update('5', question) as Question;
    expect(entity).not.toBeUndefined();
    expect(entity.type).toBe(EntityType.Question);
    expect(entity.text).toEqual([{ locale: 'de', value: 'Test text' }]);
  });
  it('should delete entity with Id 4', () => {
    provider.create(EntityType.Question);
    let entity = provider.read('4');
    expect(entity).not.toBeUndefined();
    provider.delete('4');
    entity = provider.read('4');
    expect(entity).toBeUndefined();
  });

  it('should return array by length 3', () => {
    const list = provider.list(1, 3);
    expect(list.length).toBe(3);
    expect(list[0].id).toBe('b');
    expect(list[1].id).toBe('c');
    expect(list[2].id).toBe('e');
  });
});
