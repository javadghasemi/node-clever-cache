import { readFileSync } from 'fs';
import { resolve } from 'path';

import { expect } from '@jest/globals';
import { v4 as uuid } from 'uuid';

import SmartCache from './index.js';

const packageJson = JSON.parse(
  readFileSync(resolve(__dirname + '/package.json')).toString()
);
const name = packageJson.name;
const version = packageJson.version;

const smartCache: SmartCache = new SmartCache();

describe(`${name}@${version} on node@${process.version}`, function () {
  describe('sync style', function () {
    let data = {
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
      const res = await smartCache.set(data.key, data.value);
      expect(res).toBe(true);
    });

    it('get value - value exist', async () => {
      const res = await smartCache.get(data.key);
      expect(res).toBe(data.value);
    });

    it('get value - value not exist', async () => {
      const res = await smartCache.get('not found key');
      expect(res).toBe(undefined);
    });

    it('set multiple values', async () => {
      const res = await smartCache.mSet(data.multipleKeys);
      expect(res).toBe(true);
    });

    it('get multiple keys', async () => {
      const res = await smartCache.mGet([
        data?.multipleKeys[0]?.key || '',
        data?.multipleKeys[1]?.key || '',
      ]);
      expect(data.multipleKeys).toStrictEqual(res);
    });

    it('get key names', async () => {
      const res = await smartCache.keys();
      expect([
        data.key,
        data.multipleKeys[0]?.key,
        data.multipleKeys[1]?.key,
      ]).toStrictEqual(res);
    });

    it('has key', async () => {
      const res = await smartCache.has(data.key);
      expect(res).toBe(true);
    });

    it('does not have key', async () => {
      const res = await smartCache.has('not exist key');
      expect(res).toBe(false);
    });

    it('delete value', async () => {
      const res = await smartCache.del(data.key);
      expect(1).toBe(res);
    });

    it('take value', async () => {
      await smartCache.set('takenValue', data.value);
      const res = await smartCache.take('takenValue');
      const hasRes = await smartCache.has('takenValue');

      expect(data.value).toBe(res);
      expect(false).toBe(hasRes);
    });
  });
});
