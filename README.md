# Simple JSONdb [![dependencies Status](https://david-dm.org/nmaggioni/simple-jsondb/status.svg)](https://david-dm.org/nmaggioni/simple-jsondb) [![devDependencies Status](https://david-dm.org/nmaggioni/simple-jsondb/dev-status.svg)](https://david-dm.org/nmaggioni/simple-jsondb?type=dev)
A simple, no-frills, JSON storage engine for Node.JS with **100% test coverage**.

[![NPM](https://nodei.co/npm/simple-json-db.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/simple-json-db/)
[![NPM](https://nodei.co/npm-dl/simple-json-db.png?height=2)](https://nodei.co/npm/simple-json-db/)

## Installation

`npm install --save simple-json-db`

## Usage

### Instantiation
```javascript
const JSONdb = require('simple-json-db');
const db = new JSONdb('/path/to/your/database.json');
```

The prototype of the constructor is `new JSONdb(string, [object])`, and you can supply the optional `options` object by giving it as second parameter:

```
const db = new JSONdb('/path/to/your/database.json', { ... });
```

See the [Options](#options) section for more details.

#### Options

| **Key**     | **Value type** | **Description**                                                | **Default value**                   |
|-------------|----------------|----------------------------------------------------------------|-------------------------------------|
| asyncWrite  | _Boolean_      | Enables the storage to be asynchronously written to disk.      | _**false**_ (synchronous behaviour) |
| syncOnWrite | _Boolean_      | Makes the storage be written to disk after every modification. | _**true**_                          |

### Set a key
`db.set('key', 'value');`

The `key` parameter must be a string, `value` can be whatever kind of object can be stored in JSON format. _`JSON.stringify()` is your friend!_

### Get a key
`db.get('key');`

The `key` parameter must be a string. If the key exhists its value is returned, if it doesn't the function returns `undefined`.

### Check a key
`db.has('key');`

The `key` parameter must be a string. If the key exhists `true` is returned, if it doesn't the function returns `false`.

### Delete a key

`db.delete('key');`

The `key` parameter must be a string. The function returns [as per the _delete_ operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#Return_value) if the key exhists, else it returns `undefined`.

### Sync to disk
`db.sync();`

This function writes the JSON storage object to the file path specified as the parameter of the main constructor. Consult the [Options](#options) section for usage details; on default options there is no need to manually invoke it.

### Access JSON storage
`db.JSON();`

This will return **a copy** of the internal JSON storage object, for you to tinker with and loop over.

### Replace JSON storage
`db.JSON({ data });`

Giving a parameter to the `JSON` function makes the object passed replace the internal one. _Be careful, as there's no way to recover the old object if the changes have already been written to disk._

## Tests

Run `npm test` to start the combined Mocha & Chai testing suite.