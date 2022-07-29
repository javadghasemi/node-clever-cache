import EventEmitter from 'node:events';
import {SmartCacheConfig} from "../../@types/SmartCacheConfig";
import Store from "./Store";


export default class SmartCache extends EventEmitter {
  private store: Store;
  private stats: { hits: number; vsize: number; ksize: number; keys: number; misses: number } = {
    hits: 0,
    misses: 0,
    keys: 0,
    ksize: 0,
    vsize: 0
  }
  private readonly defaultConfigs: SmartCacheConfig = {
    store: new Store(),
    forceString: false,
    stdTTL: 0
  }

  constructor(private readonly config: SmartCacheConfig) {
    super();
    this.config = {
      ...this.defaultConfigs,
      ...this.config
    }

    this.store = this.config.store;
  }

  public get getStats() {
    return this.stats;
  }

  public async get(key: string): Promise<any> {
    try {
      const res = await this.store.get(key);

      /*
      if key not found return undefined
       */
      if (!res) {
        this.stats.misses++;
        return undefined;
      }

      this.stats.hits++;
      return this.unWrap(res);
    } catch (e) {
      throw e;
    }
  }

  public async set(key: string, value: any, ttl: number = this.config.stdTTL): Promise<boolean> {
    try {
      /*
      check if cache is overflowing
       */
      if (this.config.maxKeys > -1 && this.stats.keys >= this.config.maxKeys)
        throw new Error('cache over flow!!!');
      /*
      Force data to string
       */
      if (this.config.forceString && typeof value !== "string")
        value = JSON.stringify(value); // Try to serialize value to string!

      await this.store.set(key, this.wrap(value, ttl));

      /*
       Increase stored key counter
       */
      this.stats.keys++;

      this.emit('set', key, value);

      return true;
    } catch (e) {
      throw e;
    }
  }

  public async del(keys: string | string[]): Promise<number> {
    if (!Array.isArray(keys)) keys = [keys];

    let delCount = 0;
    for (let key of keys) {
      const oldValue = await this.store.get(key);
      if (oldValue) {
        await this.store.del(key);
        delCount += 1;

        /*
        calculate stats
        */
        this.stats.keys--;

        this.emit('del', key, this.unWrap(oldValue));
      }
    }

    return delCount;
  }

  public async mGet(keys: string[]): Promise<[{ key: string, val: any }]> {
    let values: [{ key: string; val: any; }];
    /*
    Set each value to store
     */
    for (const key of keys) {
      const data = {key, val: await this.get(key)};
      if (values) values.push(data);
      else values = [{key, val: await this.get(key)}];
    }

    return values;
  }

  public async mSet(keyValueSet: [{ key: string, val: any, ttl?: number}]): Promise<boolean> {
    try {
      for (const obj of keyValueSet) {
        const {key, val, ttl} = obj;
        await this.set(key, val, ttl);
      }

      return true;
    } catch (e) {
      throw e;
    }
  }

  public async take(key: string): Promise<any> {
    try {
      const res = await this.store.get(key);
      if (res) await this.store.del(key);

      return this.unWrap(res);
    } catch (e) {
      throw e;
    }
  }

  public async keys(): Promise<string[]> {
    try {
      const keys = await this.store.keys();

      return keys;
    } catch (e) {
      throw new Error('An error!!');
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      return await this.store.has(key);
    } catch (e) {
      throw e;
    }
  }

  private wrap(value: any, ttl: number): {time: number, value: any} {
    const now: number = Date.now();
    let liveTime: number = 0;
    const ttlMultiplicator: number = 1000;

    if (ttl === 0) liveTime = 0;
    else if (ttl) liveTime = now + (ttl * ttlMultiplicator);
    else {
      this.config.stdTTL === 0 ? liveTime = this.config.stdTTL : liveTime = now + (this.config.stdTTL * ttlMultiplicator);
    }

    return {
      time: liveTime,
      value: value
    };
  }

  private unWrap(value: {value?: any, time: number}): any {
    if (!value.value) return null;

    return value.value;
  }
}