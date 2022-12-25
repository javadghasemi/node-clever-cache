import { expect } from '@jest/globals';
import { v4 as uuid } from 'uuid';

import { Memory } from './src';

const memory = new Memory();

const memoryTTL = new Memory({
  stdTTL: 0.3,
  checkExpired: 0.5,
});

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

  describe('With TTL', () => {
    describe('Has validates expired TTL', () => {
      const data = {
        key: uuid(),
        val: uuid(),
      };

      it('set a key with ttl', () => {
        expect(memoryTTL.set(data.key, data.val, 0.7)).toBe(true);
      });

      it('check TTL key immediately', () => {
        expect(memoryTTL.has(data.key)).toBe(true);
      });

      it('before it times out', (done) => {
        setTimeout(() => {
          const status = memoryTTL.has(data.key);
          expect(status).toBe(true);
          expect(memoryTTL.get(data.key)).toBe(data.val);
          done();
        }, 20);
      });

      it('after it timed out', (done) => {
        setTimeout(() => {
          const status = memoryTTL.has(data.key);
          expect(status).toBe(false);
          expect(memoryTTL.get(data.key)).toBeUndefined();
          done();
        }, 900);
      });
    });
  });
});
