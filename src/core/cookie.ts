type options = {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict";
  priority?: "low" | "medium" | "high";
  partitioned?: boolean;
}

export class CookieObject {
  name: string;
  value: string;
  options?: options;
  constructor(name: string, value: string, options?: options) {
    this.name = name;
    this.value = value;
    this.options = options;
  }
}

export default class Cookie {
  cookieStore: Map<string, CookieObject>;
  constructor(cookieStore?: Map<string, CookieObject>) {
    this.cookieStore = cookieStore || new Map();
  }
  set(name: string, value: string, options?: options) {
    const cookieObj = new CookieObject(name, value, options);
    this.cookieStore.set(name, cookieObj);
  }
  get(name: string) {
    return this.cookieStore.get(name).value;
  }
  has(name: string) {
    return this.cookieStore.has(name);
  }
  toHeaderString(): string {
    let cookieHeader = "";
    for (let [name, cookieObj] of this.cookieStore.entries()) {
      cookieHeader += `Set-Cookie: ${name}=${cookieObj.value}${parseParameterString(cookieObj.options)}\r\n`;
    }
    return cookieHeader;
  }
}

function parseParameterString(options: options) {
  let parameterStr = "";
  if (options) {
    for (let [key, value] of Object.entries(options)) {
      parameterStr += `; ${key}=${value}`
    }
  }
  return parameterStr;

}
