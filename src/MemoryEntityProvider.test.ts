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

  it('should find entity by Id a', async () => {
    expect(await provider.read('a')).toBe(entities[0]);
  });
  it('should find entity by Id b', async () => {
    expect(await provider.read('b')).toBe(entities[1]);
  });
  it('should find entity by Id c', async () => {
    expect(await provider.read('c')).toBe(entities[2]);
  });
  it('should not find entity by Id d', async () => {
    expect(await provider.read('d')).toBeUndefined();
  });

  it('should create entity with Id 4', async () => {
    const entity = await provider.create(EntityType.Question);
    expect(entity.id).toBe('4');
    expect(entity.type).toBe(EntityType.Question);
  });
  it('should update entity with Id 4 to Question with text', async () => {
    const question: Question = (await provider.create(
      EntityType.Question
    )) as Question;
    question.text = [{ locale: 'de', value: 'Test text' }];
    let entity = (await provider.update('5', question)) as Question;
    expect(entity).not.toBeUndefined();
    expect(entity.type).toBe(EntityType.Question);
    expect(entity.text).toEqual([{ locale: 'de', value: 'Test text' }]);
  });
  it('should delete entity with Id 4', async () => {
    await provider.create(EntityType.Question);
    let entity = await provider.read('4');
    expect(entity).not.toBeUndefined();
    provider.delete('4');
    entity = await provider.read('4');
    expect(entity).toBeUndefined();
  });

  it('should return array by length 3', async () => {
    const list = await provider.list(1, 3);
    expect(list.entities.length).toBe(3);
    expect(list.entities[0].id).toBe('b');
    expect(list.entities[1].id).toBe('c');
    expect(list.entities[2].id).toBe('e');
  });
});
