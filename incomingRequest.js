import Request from "./request.js";
import parseHeaders from "./parseHeaders.ts"
/*
* function to parse a TCP buffer into http message
*/
export default function incomingRequest(buffer) {

  //attributes we shall be parsing from the buffer
  let headers = null;
  let url = null;
  let method = "GET";

  //decode the buffer to string
  const message = buffer.toString();
  //split the front (startline, headers) from the body
  const [front, body] = message.split("\r\n\r\n");
  const splitFront = front.split("\r\n");
  const startline = splitFront.shift().split(" ");
  headers = parseHeaders(splitFront);
  method = startline[0];
  url = startline[1];
  //TODO parse body according to header content type


  const req = new Request(url, headers, method, body);
  return req;
}

