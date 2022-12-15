import { EventEmitter } from 'events';

import StorageInterface from '@smart-cache/interface';

import Memory from '@smart-cache/memory';

type SmartCacheConfig = {
  storage?: StorageInterface;
  forceString?: boolean;
  maxKeys?: number;
};

export default class SmartCache extends EventEmitter {
  private storage: StorageInterface;

  private readonly config: SmartCacheConfig = {
    forceString: false,
  };

  constructor(private readonly userConfig?: SmartCacheConfig) {
    super();
    this.config = {
      ...this.userConfig,
      ...this.config,
    };

    this.storage = this.config.storage ? this.config.storage : new Memory();
  }

  public async get(key: string): Promise<any> {
    const res = await this.storage.get(key);

    /*
    if key not found return undefined
     */
    if (!res) {
      return undefined;
    }

    return res;
  }

  public async set(key: string, value: any): Promise<boolean> {
    /*
    Force data to string
     */
    if (this.config.forceString && typeof value !== 'string')
      value = JSON.stringify(value); // Try to serialize value to string!

    await this.storage.set(key, value);

    this.emit('set', key, value);

    return true;
  }

  public async del(keys: string | string[]): Promise<number> {
    if (!Array.isArray(keys)) keys = [keys];

    let delCount = 0;
    for (let key of keys) {
      const oldValue = await this.storage.get(key);
      if (oldValue) {
        await this.storage.del(key);
        delCount += 1;

        this.emit('del', key, oldValue);
      }
    }

    return delCount;
  }

  public async mGet(keys: string[]): Promise<{ key: string; val: any }[] | undefined> {
    let values: { key: string; val: any }[] | undefined;
    /*
    Set each value to storage
     */
    for (const key of keys) {
      const data = { key, val: await this.get(key) };

      if (!values) values = [data];
      else values.push(data);
    }

    return values;
  }

  public async mSet(keyValueSet: { key: string; val: any }[]): Promise<boolean> {
    for (const obj of keyValueSet) {
      const { key, val } = obj;
      await this.set(key, val);
    }

    return true;
  }

  public async take(key: string): Promise<any> {
    const res = await this.storage.get(key);
    if (res) await this.storage.del(key);

    return res;
  }

  public async keys(): Promise<string[]> {
    return this.storage.keys();
  }

  public async has(key: string): Promise<boolean> {
    return this.storage.has(key);
  }
}
