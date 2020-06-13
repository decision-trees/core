import { SessionProvider, SessionStatus } from './model/SessionProvider';
import { EntityProvider, Entity, AnswerValue } from './model';
import { Session } from './model';
import { DecisionTree } from './DecisionTree';
import { KeyValuePair } from './model/KeyValuePair';
import { DecisionTreeError, ErrorCode } from './DecisionTreeError';
import { Action } from './model/Actions';

export class DecisionTreeTrustee {
  private decisionTree: DecisionTree;

  constructor(
    private sessionProvider: SessionProvider,
    entityProvider: EntityProvider
  ) {
    this.decisionTree = new DecisionTree(entityProvider);
  }

  getSession(id: string): Session {
    return this.sessionProvider.getSession(id);
  }

  openSession(
    user: string,
    target = 'anonymous',
    scope?: KeyValuePair[],
    parentId?: string
  ): Session {
    const session = this.sessionProvider.open(user, target, scope, parentId);
    this.sessionProvider.addEntry(session.id, {
      action: Action.Open,
      scope,
      created: new Date(),
      user,
    });
    return session;
  }

  suspendSession(id: string, user: string): Session {
    const session = this.sessionProvider.changeStatus(
      id,
      SessionStatus.Suspended
    );
    this.sessionProvider.addEntry(session.id, {
      action: Action.Suspend,
      created: new Date(),
      user,
    });
    return session;
  }

  resumeSession(id: string, user: string): Session {
    const session = this.sessionProvider.changeStatus(
      id,
      SessionStatus.Resumed
    );
    this.sessionProvider.addEntry(session.id, {
      action: Action.Resume,
      created: new Date(),
      user,
    });
    return session;
  }

  closeSession(id: string, user: string): Session {
    const session = this.sessionProvider.changeStatus(id, SessionStatus.Closed);
    this.sessionProvider.addEntry(session.id, {
      action: Action.Close,
      created: new Date(),
      user,
    });
    return session;
  }

  nextEntity(
    sessionId: string,
    entityId: string,
    answer: AnswerValue,
    scope: KeyValuePair[],
    user: string
  ): Entity | undefined {
    let session = this.getSession(sessionId);
    if (session.status === SessionStatus.Closed) {
      throw new DecisionTreeError(
        ErrorCode.SessionClosed,
        'The session is already closed. Use the session Id to open a new session.'
      );
    }
    if (session.status === SessionStatus.Suspended) {
      this.resumeSession(sessionId, user);
    }
    session = this.sessionProvider.mergeScope(sessionId, scope);
    const nextEntity = this.decisionTree.next(entityId, answer, session.scope);
    if (nextEntity != null) {
      this.sessionProvider.addEntry(sessionId, {
        action: Action.Next,
        entityId,
        answer,
        scope,
        nextId: nextEntity.id,
        nextType: nextEntity.type,
        user,
        created: new Date(),
      });
    }
    return nextEntity;
  }
}
