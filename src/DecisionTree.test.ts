import { MemoryEntityProvider } from './MemoryEntityProvider';
import { DecisionTree } from './DecisionTree';
import {
  EntityProvider,
  EntityType,
  AnswerValueSingle,
  ValueType,
  AnswerValueComparator,
} from './model';
import { ErrorCode } from './DecisionTreeError';

describe('DecisionTree', () => {
  let provider: EntityProvider;
  let decisionTree: DecisionTree;
  const entities = [
    {
      id: 'a',
      type: EntityType.Question,
      answers: [
        { value: new AnswerValueSingle(ValueType.integer, 1), targetId: 'b' },
        { value: new AnswerValueSingle(ValueType.integer, 2), targetId: 'c' },
      ],
    },
    {
      id: 'b',
      type: EntityType.Question,
      answers: [
        { value: new AnswerValueSingle(ValueType.integer, 1), targetId: 'd' },
        { value: new AnswerValueSingle(ValueType.integer, 2), targetId: 'e' },
      ],
    },
    {
      id: 'c',
      type: EntityType.Question,
      answers: [
        { value: new AnswerValueSingle(ValueType.integer, 3), targetId: 'e' },
        { value: new AnswerValueSingle(ValueType.integer, 4), targetId: 'd' },
      ],
    },
    { id: 'd', type: EntityType.Solution },
    { id: 'e', type: EntityType.Solution },
  ];

  beforeAll(() => {
    provider = new MemoryEntityProvider(entities);
    decisionTree = new DecisionTree(provider);
  });

  it('should calculate next entity to be question with Id b', async () => {
    const entity = await decisionTree.next(
      'a',
      new AnswerValueSingle(ValueType.integer, 1)
    );
    expect(entity.type).toBe(EntityType.Question);
    expect(entity.id).toBe('b');
  });
  it('should calculate from b next entity to be solution with Id d', async () => {
    const entity = await decisionTree.next(
      'b',
      new AnswerValueSingle(ValueType.integer, 1)
    );
    expect(entity.type).toBe(EntityType.Solution);
    expect(entity.id).toBe('d');
  });
  it('should calculate from b next entity to be solution with Id e', async () => {
    const entity = await decisionTree.next(
      'b',
      new AnswerValueSingle(ValueType.integer, 2)
    );
    expect(entity.type).toBe(EntityType.Solution);
    expect(entity.id).toBe('e');
  });
  it('should calculate from c next entity to be solution with Id e', async () => {
    const entity = await decisionTree.next(
      'c',
      new AnswerValueSingle(ValueType.integer, 3)
    );
    expect(entity.type).toBe(EntityType.Solution);
    expect(entity.id).toBe('e');
  });
  it('should calculate from c next entity to be solution with Id d', async () => {
    const entity = await decisionTree.next(
      'c',
      new AnswerValueSingle(ValueType.integer, 4)
    );
    expect(entity.type).toBe(EntityType.Solution);
    expect(entity.id).toBe('d');
  });

  it('should fail with ErrorCode.NotFound', async () => {
    try {
      await decisionTree.next('f', new AnswerValueSingle(ValueType.integer, 1));
      expect('should').toBe('not reached');
    } catch (e) {
      expect(e.code).toBe(ErrorCode.NotFound);
    }
  });
  it('should fail with ErrorCode.InvalidType', async () => {
    try {
      await decisionTree.next('d', new AnswerValueSingle(ValueType.integer, 1));
      expect('should').toBe('not reached');
    } catch (e) {
      expect(e.code).toBe(ErrorCode.InvalidType);
    }
  });
  it('should fail with ErrorCode.InvalidAnswer', async () => {
    try {
      await decisionTree.next('a', new AnswerValueSingle(ValueType.integer, 3));
      expect('should').toBe('not reached');
    } catch (e) {
      expect(e.code).toBe(ErrorCode.InvalidAnswer);
    }
  });
});
