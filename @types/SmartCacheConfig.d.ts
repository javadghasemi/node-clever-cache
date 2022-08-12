import Store from "../src/lib/Store";

export type SmartCacheConfig = {
  store?: Store,
  forceString?: boolean,
  maxKeys?: number,
  stdTTL?: number
};