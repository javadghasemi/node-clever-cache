import should from "should";
import {readFileSync} from "fs";
import {resolve} from "path";

const packageJson = JSON.parse(readFileSync(resolve(__dirname + './../../package.json')).toString());

import {randomString} from "./helpers";

import Cache from '../index';

const name = packageJson.name;
const version = packageJson.version;

const localCache = new Cache({
  maxKeys: 10,
  stdTTL: 0
});

describe(`${name}@${version} on node@${process.version}`, function () {
  describe('sync style', function () {
    let data;
    before(function () {
      data = {
        value: randomString(100),
        value1: randomString(100),
        value2: randomString(100),
        value3: randomString(100),
        key: randomString(10),
        multipleKeys: [
          {
            key: randomString(10),
            val: randomString(100)
          },
          {
            key: randomString(10),
            val: randomString(100)
          }
        ],
        obj: {
          a: 1,
          b: {
            x: 2,
            y: 3
          },
          otp: randomString(10)
        }
      };
    });

    it('set value', async () => {
      const res = await localCache.set(data.key, data.value);
      should(true).eql(res);
    });

    it('get value', async () => {
      const res = await localCache.get(data.key);
      should(data.value).eql(res);
    });

    it('set multiple values', async () => {
      const res = await localCache.mSet(data.multipleKeys);
      should(true).eql(res);
    });

    it('get multiple keys', async () => {
      const res = await localCache.mGet([data.multipleKeys[0].key, data.multipleKeys[1].key]);
      should(data.multipleKeys).eql(res);
    });

    it('get key names', async () => {
      const res = await localCache.keys();
      should([data.key, data.multipleKeys[0].key, data.multipleKeys[1].key]).eql(res);
    });

    it('has key', async () => {
      const res = await localCache.has(data.key);
      should(res).eql(true);
    });

    it('does not have key', async () => {
      const res = await localCache.has('not exist key');
      should(res).eql(false);
    });

    it('delete value', async () => {
      const res = await localCache.del(data.key);
      should(1).eql(res);
    });

    it('take value', async () => {
      await localCache.set('takenValue', data.value);
      const res = await localCache.take('takenValue');
      const hasRes = await localCache.has('takenValue');

      should(data.value).eql(res);
      should(false).eql(hasRes);
    });

    it('Overflow error', async () => {
      try {
        for (let i = 0; i < 11; i++) {
          await localCache.set('overFlowKey_' + i, data.value);
        }
      }
      catch (e) {
        should(e).instanceOf(Error);
        should(e.message).eql('cache over flow!!!');
      }
    });
  });
});