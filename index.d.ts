declare class JSONdb {
  constructor(filePath: string, options?: { asyncWrite?: boolean, syncOnWrite?: boolean });
  
  set(key: string, value: object) : void;
  get(key: string) : object | undefined;
  has(key: string) : boolean;
  delete(key: string) : boolean | undefined;
  deleteAll() : this;
  sync() : void;
  JSON(storage?: object) : object;
}

export = JSONdb;
