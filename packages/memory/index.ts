import StorageInterface from '@smart-cache/interface';

export default class Memory implements StorageInterface {
  private cacheContainer: Map<string, any> = new Map();

  public set(key: string, value: any): boolean {
    this.cacheContainer.set(key, value);

    return true;
  }

  public get(key: string): any {
    if (this.cacheContainer.has(key)) {
      return this.cacheContainer.get(key);
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
}
