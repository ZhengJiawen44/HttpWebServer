# HttpWebServer

A naive implementation of an http web server written on top of node's ```net``` module.

## Features
- Compression negotiation with client. ([more](#4-function-parseheaders))
- HTTP/HTTPS support
- Cookie parsing and management for requests and responses
- fast, simple and intuitive access to headers
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
    - [Server(requestListener, options)](#serverrequestlistener-options)
    - [Server.listen(port, host, onServerStart)](#serverlistenport-host-onserverstart)
  - [2. Function: createServer](#2-function-createserver) (deprecated)
  - [3. Function: incomingRequest](#3-function-incomingrequest)
  - [4. Function: parseHeaders](#4-function-parseheaders)
  - [5. Function: compressResponse](#5-function-compressresponse)
  - [6. Class: Request](#6-class-request)
    - [Request(url, headers, method, body)](#requesturl-headers-method-body)
  - [7. Class: Response](#7-class-response)
    - [Response(body, config)](#responsebody-config)
    - [Response.serialize](#responseserialize)
  - [8. Class: Cookie](#8-class-cookie)
    - [Cookie.set(name, value, options)](#cookiesetname-value-options)
    - [Cookie.get(name)](#cookiegetname)
    - [Cookie.has(name)](#cookiehasname)
    - [Cookie.toHeaderString()](#cookietoheaderstring)
- [Appendix](#appendix)
  - [Type: httpRequest](#type-httprequest)
  - [Type: httpResponse](#type-httpresponse)

### 1. Class: Server
The ```Server``` object is responsible for binding the TCP server to a port and manages your server request/response callbacks.

#### Server(requestListener, options)
- ```options``` ```{timeout?:number, requestQuota?:number}``` pass this to configure the max idle time since last request and max request client makes before closing the TCP connection. 
- ```requestListener``` ```async(req)=>serverResponse``` constructor for the Server Object that manages incoming server requests and responses.
	```js
	import Server from "./HttpServer.ts";
	import Response from "./response.ts";
	
    const options = {timeout:5000, requestQuota:999};
	const server = new Server(
        async(req)=>{
		    return new Response(JSON.stringify(body), {status:200, headers: {"Content-Length":"11"}})
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
this function is deprecated in favour of creating servers using ```new Server()``` instead. No factory method was required for this fck-ass web server.
#### createServer(cb):
- ```cb``` ```(req)=>serverResponse``` same as the callback in  [Server class](#1-class-server) above. constructor for the Server Object that manages incoming server requests and responses.
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
- ```buffer``` ```Buffer``` buffer object containing raw bytes received from the TCP socket.
- returns ```req``` object containing url, headers, method, body, and cookies parsed from the buffer.
```js
import incomingRequest from "./incomingRequest.ts"

 const req = incomingRequest(data);
```

### 4. Function: parseHeaders
utility function to construct a header object from an array of string key value pairs. Used by ```incomingRequest``` to parse headers.
#### parseHeaders(headerList)
- headerList ```string[]``` an array of strings containing header key and value pairs.
- returns ```headerStore``` a map containing all headers stored in key value pairs. The ```Accept-Encoding``` , ```Accept```,  ```Accept-Language``` headers are automatically parsed and sorted according to their weights into an array of types.
```js
	import parseHeader from "./parseHeader.ts";
	const headers = parseHeader(["Content-Type:text/html", "Content-Length:11"]);
	headers.get("content-length"); //returns "11"
	headers.get("Accept-Encoding"); //returns string[] of encoding types
```

### 5. Function: compressResponse
utility function to compress response bodies using various compression algorithms based on client-supported encodings.
#### compressResponse(response, compressionEncodings)
- ```response``` ```string | Buffer``` the response body to compress
- ```compressionEncodings``` ```string[]``` array of compression encodings supported by the client (e.g., `["gzip", "deflate", "br"]`)
- returns ```Promise<[Buffer, string]>``` a tuple containing the compressed buffer and the chosen encoding type
```js
import compressResponse from "./utils/compressResponse.ts";

const encodings = req.headers.get("Accept-Encoding") as string[];
const [compressedResponse, chosenEncoding] = await compressResponse(res.body, encodings);
if (chosenEncoding != null) {
  res.body = compressedResponse;
  res.headers.set("Content-Encoding", chosenEncoding);
}
```
Supported compression algorithms: `gzip`, `deflate`, `br` (Brotli), and `zstd`.

### 6. Class: Request

The `Request` class represents an HTTP request received by the server. It encapsulates the URL, headers, HTTP method, body, and cookies.

#### Request(url, headers, method, body)

-   `url` **string**: the requested URL (e.g., `/`, `/api/data`)
-   `headers` **Map<string, string | string[]>**: headers parsed from the TCP buffer    
-   `method` **string**: HTTP method (`GET`, `POST`, etc.)    
-   `body` **string**: optional request body content
-   `cookie` **Cookie**: Cookie object containing parsed cookies from the request's `Cookie` header

```js
import Request from "./request.ts";

// accessing cookies from request
const sessionId = req.cookie.get("sessionId");
if (req.cookie.has("user")) {
  // do something with user cookie
}
```

### 7. Class: Response
The `Response` class is responsible for constructing an HTTP response and serializing it according to the HTTP specification.

#### Response(body, config)

-   `body` **string | Buffer**: the response body content    
-   `config` **object**:    
    -   `status` **number**: HTTP status code (default `200`)        
    -   `headers` **Record<string, string>**: additional headers
-   `cookie` **Cookie**: Cookie object for setting response cookies        
-   Automatically sets `Content-Length` header based on `Buffer.byteLength`
```js
import Response from "./response.ts";

const res = new Response("Hello World", { 
  status: 200, 
  headers: { 'Content-Type': 'text/plain' } 
});

// setting cookies
res.cookie.set("sessionId", "abc123", { 
  httpOnly: true, 
  sameSite: "lax",
  maxAge: 3600 
});

console.log(res.serialize());
/*
HTTP/1.1 200\r\n                   <--start-line
Content-Type: text/plain\r\n       <--header
Content-Length: 11\r\n             <--header
Set-Cookie: sessionId=abc123; httpOnly=true; sameSite=lax; maxAge=3600\r\n  <--cookie
\r\n                               <--header END
Hello World                        --body
*/
```
#### Response.serialize

Serializes the `Response` object into a **valid HTTP message string** with start-line, headers, cookies, and body. Used to send the response over a TCP socket.

#### serialize()
-   Returns `Buffer`: the raw HTTP response ready to send, including `HTTP/1.1 <status>`, headers, cookies, and body.

### 8. Class: Cookie
The `Cookie` class manages cookies for both requests and responses. It provides a simple interface for setting, getting, and checking cookies.

#### Cookie.set(name, value, options)
- `name` **string**: cookie name
- `value` **string**: cookie value
- `options` **object**: optional cookie attributes
  - `expires` **Date**: expiration date
  - `maxAge` **number**: max age in seconds
  - `domain` **string**: cookie domain
  - `path` **string**: cookie path
  - `secure` **boolean**: secure flag
  - `httpOnly` **boolean**: httpOnly flag
  - `sameSite` **"lax" | "strict"**: sameSite attribute
  - `priority` **"low" | "medium" | "high"**: priority attribute
  - `partitioned` **boolean**: partitioned flag

```js
res.cookie.set("token", "xyz789", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 86400
});
```

#### Cookie.get(name)
- `name` **string**: cookie name
- returns **string**: cookie value

```js
const userId = req.cookie.get("userId");
```

#### Cookie.has(name)
- `name` **string**: cookie name
- returns **boolean**: true if cookie exists

```js
if (req.cookie.has("auth")) {
  // user is authenticated
}
```

#### Cookie.toHeaderString()
- returns **string**: formatted `Set-Cookie` header string ready for HTTP response

```js
const cookieHeader = res.cookie.toHeaderString();
// "Set-Cookie: name=value; httpOnly=true\r\n"
```

## Appendix

### Type: httpRequest
A TypeScript type describing the shape of a request object:
```js
export type httpRequest = {
  url: string;
  headers: Map<string, string | string[]>;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
  body: string;
  cookie: Cookie;
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
