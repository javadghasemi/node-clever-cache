import { StorageInterface } from '@clever-cache/interface';

type MemoryStorageOptions = {
  stdTTL?: number; // Standard "Time To Live" in seconds
  checkExpired?: number; // Time in second to check and drop expired keys
};

export class Memory implements StorageInterface {
  private cacheContainer: Map<string, any> = new Map();
  private readonly options: MemoryStorageOptions = {
    stdTTL: 0,
    checkExpired: 600,
  };

  constructor(options?: MemoryStorageOptions) {
    this.options = {
      ...options,
      ...this.options,
    };
  }

  public set(
    key: string,
    value: any,
    ttl: number | undefined = this.options.stdTTL
  ): boolean {
    this.cacheContainer.set(key, this.wrap(value, ttl));

    return true;
  }

  public get(key: string): any {
    if (this.cacheContainer.has(key)) {
      return this.unwrap(this.cacheContainer.get(key));
    }

    return undefined;
  }

  public del(key: string): boolean {
    if (!this.cacheContainer.has(key)) return false;

    this.cacheContainer.delete(key);
    return true;
  }

  public keys(): string[] {
    return [...this.cacheContainer.keys()];
  }

  public has(key: string): boolean {
    return this.cacheContainer.has(key);
  }

  private wrap(value: any, ttl: number | undefined): { value: any; ttl: number } {
    const now = Date.now();
    let liveTime = 0;

    /*
     Convert TTL time to second
     */
    const ttlMultiplication = 1000;

    if (ttl === 0 || this.options.stdTTL === 0) liveTime = 0;
    else if (ttl) liveTime = now + ttl * ttlMultiplication;
    else if (this.options.stdTTL)
      liveTime = now + this.options.stdTTL * ttlMultiplication;

    return {
      value,
      ttl: liveTime,
    };
  }

  private unwrap(wrappedValue: { value: any; ttl: number }): any {
    if (wrappedValue.value) return wrappedValue.value;

    return null;
  }
}
