import Cookie, { CookieObject } from "./cookie.ts";
import parseCookiefromHeader from "../utils/parseCookieFromHeader.ts";
/*
 * server request class, repsonsible for constructing request object and also deserializing buffer input from TCP
 */
export default class Request {
  url: string;
  headers: Map<string, string | string[]>;
  cookie: Cookie;
  method: string;
  body: string;
  constructor(url: string, headers: Map<string, string | string[]>, method: string, body: string) {
    this.url = url;
    this.headers = headers;
    this.method = method;
    this.body = body;
    this.cookie = parseCookiefromHeader(this.headers.get("Cookie") as string);
  }

}

