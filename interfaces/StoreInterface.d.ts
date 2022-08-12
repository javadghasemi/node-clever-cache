export default interface StoreInterface {
  get(key: string): any;
  set(key: string, value: any, ttl?: number): boolean;
  del(key: string);
}