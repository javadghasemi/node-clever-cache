import should from "should";
import {readFileSync} from "fs";

const packageJson = JSON.parse(readFileSync('./../../package.json').toString());

import {randomString} from "./helpers";

import Cache from '../index';

const name = packageJson.name;
const version = packageJson.version;

const localCache = new Cache({
  stdTTL: 0
});
const localCacheTTL = new Cache({
  stdTTL: 0.3
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
      should(1).eql(localCache.getStats.keys);
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
      console.log(res)
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
  });

  describe('TTL', () => {
    let stats;
    before(() => {
      stats = {
        n: 0,
        val: randomString(20),
        key1: `k1_${randomString(20)}`,
        key2: `k2_${randomString(20)}`,
        key3: `k3_${randomString(20)}`,
        key4: `k4_${randomString(20)}`,
        key5: `k5_${randomString(20)}`,
        key6: `k6_${randomString(20)}`,
        now: Date.now(),
        keys: []
      }
      stats.keys = [stats.key1, stats.key2, stats.key3, stats.key4, stats.key5];
    });

    describe('Has validates expired ttl', function () {
      it('set a key with ttl', async () => {
        should(true).eql(await localCacheTTL.set(stats.key6, stats.val, 0.7));
      });

      it('check this key immediately', async () => {
        should(true).eql(await localCacheTTL.has(stats.key6));
      });

      it('before it times out',  (done) => {
        setTimeout(async () => {
          stats.n++;
          const res = await localCacheTTL.has(stats.key6);
          should(res).eql(true);
          should(stats.val).eql(localCacheTTL.get(stats.key6));
          done();
        }, 20);
      });

      it('and after it timeout', (done) => {
        setTimeout(async () => {
          const res = await localCacheTTL.has(stats.key6);
          should(res).eql(false);

          stats.n++;
          should(await localCacheTTL.get(stats.key6)).be.undefined();
          done();
        }, 800);
      });
    });
  });
});