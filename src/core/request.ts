/*
 * server request class, repsonsible for constructing request object and also deserializing buffer input from TCP
 */

export default class Request {
  url: string;
  headers: Map<string, string>;
  method: string;
  body: string;
  constructor(url: string, headers: Map<string, string>, method: string, body: string) {
    this.url = url;
    this.headers = headers;
    this.method = method;
    this.body = body;
  }

}

