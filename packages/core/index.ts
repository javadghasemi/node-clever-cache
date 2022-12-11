import EventEmitter from 'node:events';

import StorageInterface from '@smart-cache/interface';

import Memory from '@smart-cache/memory';

type SmartCacheConfig = {
  store?: StorageInterface,
  forceString?: boolean,
  maxKeys?: number,
  stdTTL?: number
};


export default class SmartCache extends EventEmitter {
  private store: StorageInterface;

  private readonly defaultConfigs: SmartCacheConfig = {
    forceString: false,
    stdTTL: 0,
  }

  constructor(private readonly config: SmartCacheConfig) {
    super();
    this.config = {
      ...this.defaultConfigs,
      ...this.config
    }

    this.store = this.config.store ? this.config.store : new Memory();
  }

  public async get(key: string): Promise<any> {
    try {
      const res = await this.store.get(key);

      /*
      if key not found return undefined
       */
      if (!res) {
        return undefined;
      }

      return res;
    } catch (e) {
      throw e;
    }
  }

  public async set(key: string, value: any): Promise<boolean> {
    try {
      /*
      Force data to string
       */
      if (this.config.forceString && typeof value !== "string")
        value = JSON.stringify(value); // Try to serialize value to string!

      await this.store.set(key, value);

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

        this.emit('del', key, oldValue);
      }
    }

    return delCount;
  }

  public async mGet(keys: string[]): Promise<[{ key: string, val: any }]> {
    let values: [{ val: any; key: string }];
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

  public async mSet(keyValueSet: [{ key: string, val: any}]): Promise<boolean> {
    try {
      for (const obj of keyValueSet) {
        const {key, val} = obj;
        await this.set(key, val);
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

      return res;
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
}
