declare class JSONdb {
  /**
   * Main constructor, manages existing storage file and parses options against default ones.
   * @param {string} filePath The path of the file to use as storage.
   * @param {object} [options] Configuration options.
   * @param {boolean} [options.asyncWrite] Enables the storage to be asynchronously written to disk. Disabled by default (synchronous behaviour).
   * @param {boolean} [options.syncOnWrite] Makes the storage be written to disk after every modification. Enabled by default.
   * @constructor
   */
  constructor(filePath: string, options?: { asyncWrite?: boolean, syncOnWrite?: boolean });
  
  /**
   * Creates or modifies a key in the database.
   * @param {string} key The key to create or alter.
   * @param {object} value Whatever to store in the key. You name it, just keep it JSON-friendly.
   */
  set (key: string, value: object) : void;

  /**
   * Extracts the value of a key from the database.
   * @param {string} key The key to search for.
   * @returns {object|undefined} The value of the key or `undefined` if it doesn't exist.
   */
  get (key: string) : object | undefined;

  /**
   * Checks if a key is contained in the database.
   * @param {string} key The key to search for.
   * @returns {boolean} `True` if it exists, `false` if not.
   */
  has (key: string) : boolean;

  /**
   * Deletes a key from the database.
   * @param {string} key The key to delete.
   * @returns {boolean|undefined} `true` if the deletion succeeded, `false` if there was an error, or `undefined` if the key wasn't found.
   */
  delete (key: string) : boolean | undefined;

  /**
   * Deletes all keys from the database.
   * @returns {object} The JSONdb instance itself.
   */
  deleteAll () : this;

  /**
   * Writes the local storage object to disk.
   */
  sync() : void;

  /**
   * If no parameter is given, returns **a copy** of the local storage. If an object is given, it is used to replace the local storage.
   * @param {object} storage A JSON object to overwrite the local storage with.
   * @returns {object} Clone of the internal JSON storage. `Error` if a parameter was given and it was not a valid JSON object.
   */
  JSON(storage?: object) : this;
}

export = JSONdb;