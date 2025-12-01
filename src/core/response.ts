/*
 * server response class, repsonsible for constructing a response object and parsing to RFC http message automatically
 */

import Cookie from "./cookie.ts";

export default class Response {
  body?: string | Buffer;
  status?: number;
  cookie: Cookie;
  headers?: Map<string, string | string[]>
  constructor(body?: Buffer | string, config?: { status?: number, headers?: Record<string, string> }) {
    this.body = body;
    this.status = config?.status || 200;
    this.cookie = new Cookie();
    this.headers = new Map(Object.entries(config?.headers || {}));
    this.headers.set("Content-Length", String(Buffer.byteLength(this.body || "")));
    this.headers.set("date", new Date().toUTCString());
    this.headers.set("Access-Control-Allow-Origin", "*");
    this.headers.set("Connection", "Keep-Alive");
    this.headers.set("Access-Control-Allow-Origin", "*");
  }

  serialize() {
    const startLine = `HTTP/1.1 ${this.status}\r\n`;
    let headers = "";
    for (let [key, val] of this.headers!) {
      headers += `${key}: ${val}\r\n`
    }
    headers += this.cookie.toHeaderString();
    const body = Buffer.isBuffer(this.body) ? this.body : Buffer.from(this.body);
    return Buffer.concat([
      Buffer.from(startLine + headers + "\r\n"),
      body
    ]);

  }
}

