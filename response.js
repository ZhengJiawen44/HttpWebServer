/*
 * server response class, repsonsible for constructing a response object and parsing to RFC http message automatically
 */

export default class Response {
  constructor(body = "", config) {
    this.body = body;
    this.status = config.status;
    this.headers = new Map(Object.entries(config.headers || {}));
    this.headers.set("Content-Length", body.length);
  }

  serialize() {
    let startLine = `HTTP/1.1 ${this.status}\r\n`;
    let headers = "";
    for (let [key, val] of this.headers) {
      headers += `${key}: ${val}\r\n`
    }
    const serializedResponse = startLine + headers + "\r\n" + this.body;
    return serializedResponse;
  }
}

