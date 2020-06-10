import { EntityProvider } from './model/EntityProvider';
import { Question, Entity, EntityType } from './model';
import { AnswerValue, AnswerValueComparator } from './model/AnswerValue';
import { DecisionTreeError, ErrorCode } from './DecisionTreeError';

export class DecisionTree {
  constructor(private provider: EntityProvider) {}

  next(id: string, answerValue: AnswerValue): Entity {
    const entity = this.provider.getEntity(id);
    if (entity) {
      if (entity.type === EntityType.Question) {
        const question = entity as Question;
        const answer = question.answers.find(
          (entry) => AnswerValueComparator(entry.value, answerValue) === 0
        );
        // console.log(id, answer, answerValue);
        if (answer) {
          const result = this.provider.getEntity(answer.targetId);
          if (result) {
            return result;
          }
          throw new DecisionTreeError(
            ErrorCode.NotFound,
            `No entity found for answer target Id "${answer.targetId}"`
          );
        }
        throw new DecisionTreeError(
          ErrorCode.InvalidAnswer,
          'The given answer is invalid.'
        );
      }
      throw new DecisionTreeError(
        ErrorCode.InvalidType,
        'The type of the entity is invalid.'
      );
    }
    throw new DecisionTreeError(
      ErrorCode.NotFound,
      'No entity for the given Id.'
    );
  }
}
