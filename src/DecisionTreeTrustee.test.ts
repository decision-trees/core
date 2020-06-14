import { DecisionTreeTrustee } from './DecisionTreeTrustee';
import { SessionProvider, SessionStatus } from './model/SessionProvider';
import { DecisionTreeEvaluator } from './model/DecsisionTreeEvaluator';
import { KeyValuePair } from './model/KeyValuePair';
import {
  Session,
  AnswerValue,
  Entity,
  EntityType,
  Question,
  AnswerValueSingle,
  ValueType,
  EntityProvider,
} from './model';
import { SessionHistoryEntry } from './model/SessionHistoryEntry';
import { Action } from './model/Actions';
import { DecisionTree } from './DecisionTree';

const testUser = 'test-user';
const testTarget = 'test-customer';
const testDate = new Date();

const nop = jest.fn(() => undefined);

describe('DecisionTreeTrustee', () => {
  let trustee: DecisionTreeTrustee;

  let sessionProvider: SessionProvider;
  let decsisionTreeEvaluator: DecisionTreeEvaluator;

  beforeEach(() => {
    sessionProvider = ({
      getSession: nop,
      open: nop,
      addEntry: nop,
      suspendSession: nop,
      resumeSession: nop,
      closeSession: nop,
      mergeScope: nop,
    } as unknown) as SessionProvider;
    decsisionTreeEvaluator = new DecisionTree({} as EntityProvider);
    trustee = new DecisionTreeTrustee(sessionProvider, decsisionTreeEvaluator);
  });

  it('should open session', () => {
    sessionProvider.open = jest.fn(
      (
        user: string,
        target: string,
        scope?: KeyValuePair[],
        parentId?: string
      ) => {
        return {
          id: 'newSession',
          status: SessionStatus.Opened,
          creator: user,
          target,
          scope,
          parentId,
          created: testDate,
        } as Session;
      }
    );
    let created;
    sessionProvider.addEntry = jest.fn(
      (id: string, entry: SessionHistoryEntry) => {
        created = entry.created;
      }
    );
    const scope = [{ key: 'some', value: 'test data' }];
    const session = trustee.openSession(testUser, testTarget, scope);
    expect((sessionProvider.open as jest.Mock).mock.calls.length).toBe(1);
    expect((sessionProvider.addEntry as jest.Mock).mock.calls.length).toBe(1);
    expect(sessionProvider.addEntry).toHaveBeenCalledWith('newSession', {
      action: Action.Open,
      scope,
      created,
      user: testUser,
    });
    expect(session.id).toBe('newSession');
    expect(session.status).toBe(SessionStatus.Opened);
    expect(session.creator).toBe(testUser);
    expect(session.target).toBe(testTarget);
    expect(session.scope).toBe(scope);
    expect(session.parentId).toBeUndefined();
    expect(session.created).toBe(testDate);
  });

  it('should change session status to suspended', () => {
    sessionProvider.changeStatus = jest.fn(
      (id: string, status: SessionStatus) => {
        return { id, status } as Session;
      }
    );
    let created;
    sessionProvider.addEntry = jest.fn(
      (id: string, entry: SessionHistoryEntry) => {
        created = entry.created;
      }
    );
    const session = trustee.suspendSession('mySession', testUser);
    expect((sessionProvider.changeStatus as jest.Mock).mock.calls.length).toBe(
      1
    );
    expect((sessionProvider.addEntry as jest.Mock).mock.calls.length).toBe(1);
    expect(sessionProvider.addEntry).toHaveBeenCalledWith('mySession', {
      action: Action.Suspend,
      created,
      user: testUser,
    });
    expect(session.id).toBe('mySession');
    expect(session.status).toBe(SessionStatus.Suspended);
  });

  it('should change session status to resumed', () => {
    sessionProvider.changeStatus = jest.fn(
      (id: string, status: SessionStatus) => {
        return { id, status } as Session;
      }
    );
    let created;
    sessionProvider.addEntry = jest.fn(
      (id: string, entry: SessionHistoryEntry) => {
        created = entry.created;
      }
    );
    const session = trustee.resumeSession('mySession', testUser);
    expect((sessionProvider.changeStatus as jest.Mock).mock.calls.length).toBe(
      1
    );
    expect((sessionProvider.addEntry as jest.Mock).mock.calls.length).toBe(1);
    expect(sessionProvider.addEntry).toHaveBeenCalledWith('mySession', {
      action: Action.Resume,
      created,
      user: testUser,
    });
    expect(session.id).toBe('mySession');
    expect(session.status).toBe(SessionStatus.Resumed);
  });

  it('should change session status to closed', () => {
    sessionProvider.changeStatus = jest.fn(
      (id: string, status: SessionStatus) => {
        return { id, status } as Session;
      }
    );
    let created;
    sessionProvider.addEntry = jest.fn(
      (id: string, entry: SessionHistoryEntry) => {
        created = entry.created;
      }
    );
    const session = trustee.closeSession('mySession', testUser);
    expect((sessionProvider.changeStatus as jest.Mock).mock.calls.length).toBe(
      1
    );
    expect((sessionProvider.addEntry as jest.Mock).mock.calls.length).toBe(1);
    expect(sessionProvider.addEntry).toHaveBeenCalledWith('mySession', {
      action: Action.Close,
      created,
      user: testUser,
    });
    expect(session.id).toBe('mySession');
    expect(session.status).toBe(SessionStatus.Closed);
  });

  it('should evaluate next entity', () => {
    decsisionTreeEvaluator.next = jest.fn(
      (id: string, answer: AnswerValue, scope: KeyValuePair[]): Entity => {
        return ({
          id: 'expectedQuestion',
          type: EntityType.Question,
          answers: [],
        } as unknown) as Question;
      }
    );
    const session = ({
      id: 'mySession',
      status: SessionStatus.Opened,
      scope: [],
    } as unknown) as Session;
    sessionProvider.getSession = jest.fn((id: string) => {
      return session;
    });
    sessionProvider.mergeScope = jest.fn(
      (id: string, scope: KeyValuePair[], user: string): Session => ({
        ...session,
        scope: scope,
      })
    );
    let created;
    sessionProvider.addEntry = jest.fn(
      (id: string, entry: SessionHistoryEntry) => {
        created = entry.created;
      }
    );
    const scope = [{ key: 'some', value: 'test data' }];
    const entity = trustee.nextEntity(
      'mySession',
      'evaluateNext',
      new AnswerValueSingle(ValueType.integer, 1),
      scope,
      testUser
    );
    if (entity) {
      expect((decsisionTreeEvaluator.next as jest.Mock).mock.calls.length).toBe(
        1
      );
      expect((sessionProvider.mergeScope as jest.Mock).mock.calls.length).toBe(
        1
      );
      expect(sessionProvider.mergeScope).toHaveBeenCalledWith(
        'mySession',
        scope,
        testUser
      );
      expect((sessionProvider.addEntry as jest.Mock).mock.calls.length).toBe(1);
      expect(sessionProvider.addEntry).toHaveBeenCalledWith('mySession', {
        action: Action.Next,
        answer: new AnswerValueSingle(ValueType.integer, 1),
        entityId: 'evaluateNext',
        nextId: 'expectedQuestion',
        nextType: EntityType.Question,
        created,
        scope,
        user: testUser,
      });
      expect(entity).not.toBeUndefined();
      expect(entity.id).toBe('expectedQuestion');
      expect(entity.type).toBe(EntityType.Question);
    } else {
      expect('not').toBe('this branch');
    }
  });
});
