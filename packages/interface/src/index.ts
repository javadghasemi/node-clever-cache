export default interface StorageInterface {
  get(key: string): any;
  set(key: string, value: any, ttl?: number): boolean;
  del(key: string): boolean;
}
