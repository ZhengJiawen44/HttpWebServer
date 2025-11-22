/*
 * server request class, repsonsible for constructing request object and also deserializing buffer input from TCP
 */

export default class Request {
  constructor(url, headers, method, body) {
    this.url = url;
    this.headers = headers;
    this.method = method;
    this.body = body;
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

