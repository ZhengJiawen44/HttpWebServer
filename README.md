
# HttpWebServer

A naive implementation of an http web server written on top of node's ```net``` module.

## Features
- HTTP/HTTPS support
- Easy configuration
- Fast and minimal

## Installation
```bash
git clone https://github.com/ZhengJiawen44/HttpWebServer.git
cd HttpWebServer
npm install
npm run start # to run the minimal example
```
## Documentation
### Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Documentation](#documentation)
  - [1. Class: Server](#1-class-server)
    - [Server(requestListener, options)](#serverrequestlistener)
    - [Server.listen(port, host, onServerStart)](#serverbindport-host-onserverstart)
  - [2. Function: createServer](#2-function-createserver) (deprecated)
  - [3. Function: incomingRequest](#3-function-incomingrequest)
  - [4. Function: parseHeaders](#4-function-parseheaders)
  - [5. Class: Request](#5-class-request)
    - [Request(url, headers, method, body)](#requesturl-headers-method-body)
  - [6. Class: Response](#6-class-response)
    - [Response(body, config)](#responsebody-config)
    - [Response.serialize](#responseserialize)
- [Appendix](#appendix)
  - [Type: httpRequest](#type-httprequest)
  - [Type: httpResponse](#type-httpresponse)

### 1. Class: Server
The ```Server``` object is responsible for binding the TCP server to a port and manages your server request/response callbacks.

#### Server(requestListener, options)
- ```options``` ```{maxQuota?:number, timeout?:number}``` pass this to configure the max idle time since last request and max request client makes before closing the TCP connection. 
- ```requestListener``` ```(req)=>serverResponse``` constructor for the Server Object that manages incoming server requests and responses.
	```js
	import Server from "./HttpServer.ts";
	import Response from "./response.ts";
	
    const options = {timeout:5000, maxQuota:999};
	const server = new Server(
        (req)=>{
		    return new Response(JSON.stringify(body), {status:200, headers: "Content-Length":"11"}})
        },
        options
    )
	```
#### Server.listen(port, host, onServerStart)
- ```port``` ```number?``` a port number ranging from  0–65535 to bind your server to. defaults to 4221.
- ```host``` ```string?``` defaults to localhost but can be any network interface.
- ```onServerStart``` ```()=>void``` callback function that executes when a new TCP connection is made.
- returns ```void```
```js
const port = process.env.port;
const host = process.env.host;

server.listen(port, host, ()=>{
	console.log(`server started on http://${host}:${port}`);
})
```

### 2. Function: createServer (Deprecated)
this function is deprecated in favour of creating servers using ```new Server()``` instead
#### createServer(cb):
- ```cb``` ```(req)=>serverResponse``` same as the callabck in  [Server class](#1-class-server) above. constructor for the Server Object that manages incoming server requests and responses.
- returns ```server``` object. 
```js
	import {createServer} from "./HttpServer.ts";
	import Response from "./response.ts";
	
	const server = createServer(
  (req: httpRequest) => {
    let res = new Response("hello world", { status: 200, headers: { 'Content-Type': "text/html" } });
    //console.log("server recieved: ", req);
    //console.log("server responded with: ", res);
    return res;
  }
)
```
### 3. Function: incomingRequest
utility function used to parse a buffer input into a request object  
#### incomingRequest(buffer)
- ```buffer``` ```Buffer``` buffer object containing raw bytes recieved from the TCP socket.
- returns ```req``` object containing url, headers, method, body e.t.c parsed from the buffer.
```js
import incomingRequest from "./incomingRequest.ts"

 const req = incomingRequest(data);
```

### 4. Function: parseHeaders
utility function to construct a header object from an array of string key value pairs. Used by ```incomingRequest``` to parse headers.
#### parseHeaders(headerList)
- headerList ```string[]``` an array of strings containing header key and value pairs.
- returns ```headerStore``` a map containing all headers stored in key value pairs. 
```js
	import parseHeader from "./parseHeader.ts";
	const headers = parseHeader(["Content-Type:text/html", "Content-Length:11"]);
	headers.get("content-length"); //returns "text/html"
```
### 5. Class: Request

The `Request` class represents an HTTP request received by the server. It encapsulates the URL, headers, HTTP method, and body.

#### Request(url, headers, method, body)

-   `url` **string**: the requested URL (e.g., `/`, `/api/data`)
-   `headers` **Map<string, string>**: headers parsed from the TCP buffer    
-   `method` **string**: HTTP method (`GET`, `POST`, etc.)    
-   `body` **string**: optional request body content

### 6. Class: Response
The `Response` class is responsible for constructing an HTTP response and serializing it according to the HTTP specification.

#### Response(body, config)

-   `body` **string**: the response body content    
-   `config` **object**:    
    -   `status` **number**: HTTP status code (default `200`)        
    -   `headers` **Record<string, string>**: additional headers        
-   Automatically sets `Content-Length` header based on `body.length`
```js
import Response from "./response.ts";

const res = new Response("Hello World", { 
  status: 200, 
  headers: { 'Content-Type': 'text/plain' } 
});

console.log(res.serialize());
/*
HTTP/1.1 200\r\n                   <--start-line
Content-Type: text/plain\r\n       <--header
Content-Length: 11\r\n             <--header
\r\n                               <--header END
Hello World                        --body
*/
```
#### Response.serialize

Serializes the `Response` object into a **valid HTTP message string** with start-line, headers, and body. Used to send the response over a TCP socket.

#### serialize()
-   Returns `string`: the raw HTTP response ready to send, including `HTTP/1.1 <status>`, headers, and body.

## Appendix

### Type: httpRequest
A TypeScript type describing the shape of a request object:
```js
export type httpRequest = {
  url: string;
  headers: Map<string, string>;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
  body: string;
}
```

### Type: httpResponse
A TypeScript type describing the shape of a response object:
```js
export type httpResponse = {
  status: number;
  body: string;
  header: Record<string, string>;
}
```





