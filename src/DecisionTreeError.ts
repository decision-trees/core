export enum ErrorCode {
  NotFound,
  InvalidType,
  InvalidAnswer,
}

export class DecisionTreeError extends Error {
  constructor(public code: ErrorCode, public message: string) {
    super(message);
  }
}
