import {
  AnswerValueComparator,
  AnswerValueSingle,
  AnswerValueRange,
} from './AnswerValue';
import { ValueType } from './ValueType';

describe('AnswerValueComparator', () => {
  it('should compare same integer values to 0 ', () => {
    const value = new AnswerValueSingle(ValueType.integer, 10);
    const other = new AnswerValueSingle(ValueType.integer, 10);
    const result = AnswerValueComparator(value, other);
    expect(result).toBe(0);
  });
  it('should compare value integer with other integer values to greater 0 ', () => {
    const value = new AnswerValueSingle(ValueType.integer, 10);
    const other = new AnswerValueSingle(ValueType.integer, 11);
    const result = AnswerValueComparator(value, other);
    expect(result).toBeGreaterThan(0);
  });
  it('should compare value integer with other integer values to lesser 0 ', () => {
    const value = new AnswerValueSingle(ValueType.integer, 10);
    const other = new AnswerValueSingle(ValueType.integer, 9);
    const result = AnswerValueComparator(value, other);
    expect(result).toBeLessThan(0);
  });

  it('should compare same integer ranges to 0 ', () => {
    const value = new AnswerValueRange(ValueType.integer, 5, 20);
    const other = new AnswerValueRange(ValueType.integer, 5, 20);
    const result = AnswerValueComparator(value, other);
    expect(result).toBe(0);
  });
  it('should compare integer value range with other range to greater 0', () => {
    const value = new AnswerValueRange(ValueType.integer, 5, 20);
    const other = new AnswerValueRange(ValueType.integer, 5, 30);
    const result = AnswerValueComparator(value, other);
    expect(result).toBeGreaterThan(0);
  });
  it('should compare integer value range with other range to greater 0', () => {
    const value = new AnswerValueRange(ValueType.integer, 5, 20);
    const other = new AnswerValueRange(ValueType.integer, 5, 30);
    const result = AnswerValueComparator(value, other);
    expect(result).toBeGreaterThan(0);
  });
  it('should compare integer value range with other range to lesser 0', () => {
    const value = new AnswerValueRange(ValueType.integer, 5, 20);
    const other = new AnswerValueRange(ValueType.integer, 1, 20);
    const result = AnswerValueComparator(value, other);
    expect(result).toBeLessThan(0);
  });

  it('should compare same text values to 0 ', () => {
    const value = new AnswerValueSingle(ValueType.text, 'same');
    const other = new AnswerValueSingle(ValueType.text, 'same');
    const result = AnswerValueComparator(value, other);
    expect(result).toBe(0);
  });
  it('should compare value text with other text values to greater 0 ', () => {
    const value = new AnswerValueSingle(ValueType.text, 'b');
    const other = new AnswerValueSingle(ValueType.text, 'c');
    const result = AnswerValueComparator(value, other);
    expect(result).toBeGreaterThan(0);
  });
  it('should compare value text with other text values to lesser 0 ', () => {
    const value = new AnswerValueSingle(ValueType.text, 'b');
    const other = new AnswerValueSingle(ValueType.text, 'a');
    const result = AnswerValueComparator(value, other);
    expect(result).toBeLessThan(0);
  });
});
