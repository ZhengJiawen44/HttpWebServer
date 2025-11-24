/*
 * server response class, repsonsible for constructing a response object and parsing to RFC http message automatically
 */

export default class Response {
  body?: string | Buffer;
  status?: number;
  headers?: Map<string, string>
  constructor(body?, config?: { status?: number, headers?: Record<string, string> }) {
    this.body = body;
    this.status = config?.status || 200;
    this.headers = new Map(Object.entries(config?.headers || {}));
    this.headers.set("Content-Length", String(Buffer.byteLength(this.body || "")));
    this.headers.set("date", new Date().toUTCString());
    this.headers.set("Access-Control-Allow-Origin", "*");
    this.headers.set("Connection", "Keep-Alive");
    this.headers.set("Access-Control-Allow-Origin", "*");

  }

  serialize() {
    let startLine = `HTTP/1.1 ${this.status}\r\n`;
    let headers = "";
    for (let [key, val] of this.headers!) {
      headers += `${key}: ${val}\r\n`
    }
    if (Buffer.isBuffer(this.body)) {
      return Buffer.concat([
        Buffer.from(startLine + headers + "\r\n"),
        this.body
      ]);
    } else {
      return startLine + headers + "\r\n" + this.body;
    }
  }
}

