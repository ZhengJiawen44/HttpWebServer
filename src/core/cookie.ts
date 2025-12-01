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

class CookieObject {
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
  cookieStore: CookieObject[];
  constructor() {
    this.cookieStore = [];
  }
  setCookie(name: string, value: string, options?: options) {
    const cookieObj = new CookieObject(name, value, options);
    this.cookieStore.push(cookieObj);
  }
  toHeaderString(): string {
    let cookieHeader = "";
    for (let cookie of this.cookieStore) {
      cookieHeader += `Set-Cookie: ${cookie.name}=${cookie.value}${parseParameterString(cookie.options)}\r\n`;
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
