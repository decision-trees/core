import { ValueType } from './ValueType';

export interface AnswerValue {
  type: ValueType;
  range: boolean;
}

export class AnswerValueSingle implements AnswerValue {
  range = false;

  constructor(public type: ValueType, public value: any) {}
}

export class AnswerValueRange implements AnswerValue {
  range = true;

  constructor(public type: ValueType, public min: any, public max: any) {
    if (this.max < this.min) {
      const tmp = this.max;
      this.max = this.min;
      this.min = tmp;
    }
  }
}

export function AnswerValueComparator(value: AnswerValue, other: AnswerValue) {
  if (value != null && other != null && value.type === other.type) {
    if (value.range && other.range) {
      const range = value as AnswerValueRange;
      const otherRange = other as AnswerValueRange;
      if (range.min <= otherRange.min && range.max >= otherRange.max) {
        return 0;
      } else if (
        (range.min <= otherRange.min && range.max < otherRange.max) ||
        range.min > otherRange.max
      ) {
        return 1;
      } else if (range.min > otherRange.min && range.max >= otherRange.max) {
        return -1;
      }
    } else if (value.range && !other.range) {
      const range = value as AnswerValueRange;
      const otherSingle = other as AnswerValueSingle;
      if (range.min <= otherSingle.value && range.max >= otherSingle.value) {
        return 0;
      } else if (range.min > otherSingle.value) {
        return -1;
      } else if (range.max < otherSingle.value) {
        return 1;
      }
    } else {
      const single = value as AnswerValueSingle;
      const otherSingle = other as AnswerValueSingle;
      if (single.value === otherSingle.value) {
        return 0;
      } else if (single.value > otherSingle.value) {
        return -1;
      } else if (single.value < otherSingle.value) {
        return 1;
      }
    }
  }
  return -1;
}
