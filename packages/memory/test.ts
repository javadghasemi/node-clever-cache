import { expect } from '@jest/globals';
import { v4 as uuid } from 'uuid';

import Memory from './src/index.js';

const memory = new Memory();

describe('Memory storage driver Tests', () => {
  const data = {
    value: uuid(),
    key: uuid(),
  };

  it('Set value', () => {
    const status = memory.set(data.key, data.value);
    expect(status).toBe(true);
  });

  it('get exist value', () => {
    const res = memory.get(data.key);
    expect(res).toBe(data.value);
  });

  it('get not exist value', () => {
    const res = memory.get('not exist val');
    expect(res).toBe(undefined);
  });

  it('get key names', () => {
    const res = memory.keys();
    expect(res).toEqual([data.key]);
  });

  it('has key', () => {
    const res = memory.has(data.key);
    expect(res).toBe(true);
  });

  it('does not have key', () => {
    const res = memory.has('not exist key');
    expect(res).toBe(false);
  });

  it('delete value', () => {
    const res = memory.del(data.key);
    expect(res).toBe(true);
  });

  it('value not found for delete', () => {
    const res = memory.del('not found val');
    expect(res).toBe(false);
  });
});
