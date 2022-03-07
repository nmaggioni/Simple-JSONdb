declare class JSONdb<T = any> {
  constructor(filePath: string, options?: { asyncWrite?: boolean, syncOnWrite?: boolean, jsonSpaces?: boolean, stringify?: (o:T) => string, parse?: (s:string) => (T | undefined) });
  
  set(key: string, value: T) : void;
  get(key: string) : T | undefined;
  has(key: string) : boolean;
  delete(key: string) : boolean | undefined;
  deleteAll() : this;
  sync() : void;
  JSON(storage?: Record<string, T>) : Record<string, T>;
}

export = JSONdb;
