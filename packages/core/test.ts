import { expect } from '@jest/globals';
import { v4 as uuid } from 'uuid';

import { CleverCache } from './src';

const cleverCache: CleverCache = new CleverCache();

describe(`clever-cache Tests`, () => {
  describe('sync style', () => {
    const data = {
      value: uuid(),
      value1: uuid(),
      value2: uuid(),
      value3: uuid(),
      key: uuid(),
      multipleKeys: [
        {
          key: uuid() || '',
          val: uuid() || '',
        },
        {
          key: uuid() || '',
          val: uuid() || '',
        },
      ],
      obj: {
        a: 1,
        b: {
          x: 2,
          y: 3,
        },
        otp: uuid(),
      },
    };

    it('set value', async () => {
      const res = await cleverCache.set(data.key, data.value);
      expect(res).toBe(true);
    });

    it('get value - value exist', async () => {
      const res = await cleverCache.get(data.key);
      expect(res).toBe(data.value);
    });

    it('get value - value not exist', async () => {
      const res = await cleverCache.get('not found key');
      expect(res).toBe(undefined);
    });

    it('set multiple values', async () => {
      const res = await cleverCache.mSet(data.multipleKeys);
      expect(res).toBe(true);
    });

    it('get multiple keys', async () => {
      const res = await cleverCache.mGet([
        data?.multipleKeys[0]?.key || '',
        data?.multipleKeys[1]?.key || '',
      ]);
      expect(data.multipleKeys).toStrictEqual(res);
    });

    it('get key names', async () => {
      const res = await cleverCache.keys();
      expect([
        data.key,
        data.multipleKeys[0]?.key,
        data.multipleKeys[1]?.key,
      ]).toStrictEqual(res);
    });

    it('has key', async () => {
      const res = await cleverCache.has(data.key);
      expect(res).toBe(true);
    });

    it('does not have key', async () => {
      const res = await cleverCache.has('not exist key');
      expect(res).toBe(false);
    });

    it('delete value', async () => {
      const res = await cleverCache.del(data.key);
      expect(1).toBe(res);
    });

    it('take value', async () => {
      await cleverCache.set('takenValue', data.value);
      const res = await cleverCache.take('takenValue');
      const hasRes = await cleverCache.has('takenValue');

      expect(data.value).toBe(res);
      expect(false).toBe(hasRes);
    });
  });
});
