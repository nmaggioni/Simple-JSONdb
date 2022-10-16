<img src="https://user-images.githubusercontent.com/70700766/196008415-77fb1306-c178-4d7b-88fb-a0888d926171.png" width="300" alt="qjson-db: Dead simple JSON database">

***

A fork of [nmaggioni/Simple-JSONdb](https://github.com/nmaggioni/Simple-JSONdb), this is a dead simple JSON database for your web app.

**Install:** `npm i qjson-db`

## Usage

### Start
```javascript
const qjson = require('qjson-db');
const db = new JSONdb('/path/to/your/storage.json');
```

You can supply the optional `options` object by giving it as second parameter:

```javascript
const db = new qjson('/path/to/your/storage.json', { ... });
```

See the [Options](#options) section for more details.

#### Options

All keys are optional and will default to a safe value.

| **Key**     | **Value type**               | **Description**                                                   | **Default value**                   |
|-------------|------------------------------|-------------------------------------------------------------------|-------------------------------------|
| asyncWrite  | _Boolean_                    | Enables the storage to be asynchronously written to disk.         | _**false**_ (synchronous behaviour) |
| syncOnWrite | _Boolean_                    | Makes the storage be written to disk after every modification.    | _**true**_                          |
| jsonSpaces  | _Number_                     | The number of spaces used for indentation in the output JSON.     | _**4**_                             |
| stringify   | _Function(object) => string_ | A stringifier function to serialize JS objects into JSON strings. | _**JSON.stringify**_                |
| parse       | _Function(string) => object_ | A parser function to deserialize JSON strings into JS objects.    | _**JSON.parse**_                    |

### Set a key
`db.set('key', 'value');`

The `key` parameter must be a string, `value` can be whatever kind of object can be stored in JSON format.

### Get a key
`db.get('key');`

The `key` parameter must be a string. If the key exists its value is returned, if it doesn't the function returns `undefined`.

### Check a key
`db.has('key');`

The `key` parameter must be a string. If the key exists `true` is returned, if it doesn't the function returns `false`.

### Delete a key

`db.delete('key');`

The `key` parameter must be a string. The function returns [as per the _delete_ operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#Return_value) if the key exists, else it returns `undefined`.

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

Run `npm ci` to install the testing dependencies and `npm test` to start the test suite.