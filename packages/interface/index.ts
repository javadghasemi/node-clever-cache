export default interface StorageInterface {
  get(key: string): any | Promise<any>;
  set(key: string, value: any, ttl?: number): boolean | Promise<boolean>;
  del(key: string): boolean | Promise<boolean>;
  has(key: string): boolean | Promise<boolean>;
  keys(): string[] | Promise<string[]>;
}
