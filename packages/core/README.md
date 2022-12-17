# Simple and driveable NodeJS caching

A simple caching module that has `set`, `get` and `delete` method and can change cache database with drivers

# Install

```
npm install clever-cache --save
```

Initialize:
----

```javascript
const { CleverCache } = require('clever-cache');
const cache = new CleverCache();
```

### Options

* `storage`: _(Default is `Memory`)_ The storage you want to use for store your data.

Store a key (set):
---
`cache.set(key, val);`

Sets a key value pair. Returns true on success.

```javascript
const object = {hello: "world", age: 42};

const success = cache.set("myKey", object); // true
```

Store multiple keys (mSet):
---
`cache.mSet(Array <{key, val}>);`

Sets multiple key val pairs. Returns true on success.

```javascript
const object1 = {my: "hat", size: 30};
const object2 = {my: "shirt", size: 20};

const success = cache.mSet([
  {key: "user1", val: object1},
  {key: "user2", val: object2},
]);
```

Get a Key (get):
---
`cache.get(key)`

Gets a saved value from the cache. Return undefined if not found. If the value was found it returns the `value`.

```javascript
const value = cache.get("myKey");
if (value == undefined) {
// handle miss!
}
// {hello: "world", age: 42};
```

Take a key (take):
---
`cache.take(key)`
get the cached value and remove the key from the cache.

Equivalent to calling get(key) + del(key).

```javascript
cache.set("myKey", "myValue");
cache.has("myKey"); // returns true because the key is cached right now
const value = cache.take("myKey"); // value === "myValue"; this also deletes the key
cache.has("myKey"); // returns false because the key has been deleted
```

Get multiple keys (mGet):
---
`cache.mGet([ key1, key2, ..., keyn ])`

Gets multiple saved values from the cache. Returns an empty object `{}` if not found. If the value was found it returns
an object with the key value pair.

```javascript
const value = cache.mGet(["user1", "user2"]);
/*
{
  "myKeyA": {my: "hat", size: 30},
  "myKeyB": {my: "shirt", size: 20}
}
*/
```

Delete a key (DEL):
---

`cache.del(key)`

Delete a key. Returns the number of deleted entries. A delete will never fail.

```javascript
const value = cache.del("A");
// 1
```

Delete multiple keys (mDel):
---
`cache.del([ key1, key2, ..., keyn ])`

Delete multiple keys. Returns the number of deleted entries. A delete will never fail.

```javascript
const value = cache.del("A");
// 1

const value = cache.del(["B", "C"]);
// 2

const value = cache.del(["A", "B", "C", "D"]);
// 1 - because A, B and C not exists
```

List keys (keys)
---
`myCache.keys()`

Returns an array of all existing keys.

```javascript
const mykeys = cache.keys();

console.log(mykeys);
// [ "all", "my", "keys", "hello", "world" ]
```

Has key (has)
---

Returns boolean indicating if the key is cached.

```javascript
const exists = cache.has('myKey');

console.log(exists);
```
