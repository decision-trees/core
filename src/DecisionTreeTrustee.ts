import { SessionProvider, SessionStatus } from './model/SessionProvider';
import { EntityProvider, Entity, AnswerValue } from './model';
import { Session } from './model';
import { DecisionTree } from './DecisionTree';
import { KeyValuePair } from './model/KeyValuePair';
import { DecisionTreeError, ErrorCode } from './DecisionTreeError';
import { Action } from './model/Actions';
import { DecisionTreeEvaluator } from './model/DecsisionTreeEvaluator';

export class DecisionTreeTrustee {
  constructor(
    private sessionProvider: SessionProvider,
    private decisionTree: DecisionTreeEvaluator
  ) {}

  getSession(id: string): Promise<Session> {
    return this.sessionProvider.getSession(id);
  }

  async openSession(
    user: string,
    target = 'anonymous',
    scope?: KeyValuePair[],
    parentId?: string
  ): Promise<Session> {
    const session = await this.sessionProvider.open(
      user,
      target,
      scope,
      parentId
    );
    await this.sessionProvider.addEntry(session.id, {
      action: Action.Open,
      scope,
      created: new Date(),
      user,
    });
    return session;
  }

  async suspendSession(id: string, user: string): Promise<Session> {
    const session = await this.sessionProvider.changeStatus(
      id,
      SessionStatus.Suspended,
      user
    );
    await this.sessionProvider.addEntry(session.id, {
      action: Action.Suspend,
      created: new Date(),
      user,
    });
    return session;
  }

  async resumeSession(id: string, user: string): Promise<Session> {
    const session = await this.sessionProvider.changeStatus(
      id,
      SessionStatus.Resumed,
      user
    );
    await this.sessionProvider.addEntry(session.id, {
      action: Action.Resume,
      created: new Date(),
      user,
    });
    return session;
  }

  async closeSession(id: string, user: string): Promise<Session> {
    const session = await this.sessionProvider.changeStatus(
      id,
      SessionStatus.Closed,
      user
    );
    await this.sessionProvider.addEntry(session.id, {
      action: Action.Close,
      created: new Date(),
      user,
    });
    return session;
  }

  async nextEntity(
    sessionId: string,
    entityId: string,
    answer: AnswerValue,
    scope: KeyValuePair[],
    user: string
  ): Promise<Entity | undefined> {
    let session = await this.getSession(sessionId);
    if (session.status === SessionStatus.Closed) {
      throw new DecisionTreeError(
        ErrorCode.SessionClosed,
        'The session is already closed. Use the session Id to open a new session.'
      );
    }
    if (session.status === SessionStatus.Suspended) {
      await this.resumeSession(sessionId, user);
    }
    session = await this.sessionProvider.mergeScope(sessionId, scope, user);
    const nextEntity = await this.decisionTree.next(
      entityId,
      answer,
      session.scope
    );
    if (nextEntity != null) {
      await this.sessionProvider.addEntry(sessionId, {
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
